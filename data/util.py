import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
import seaborn as sns
import json

def to_df_ec2(path):
    with open(path, 'r') as file:
        lines = file.readlines()
    parsed_data = []
    for line in lines:
        entry = json.loads(line)
        msg_parts = entry['msg'].split('##')
        req_id = msg_parts[0]  # Treat req_id as a string
        start = int(msg_parts[1])
        result_data = json.loads(msg_parts[2])
        end = int(msg_parts[3])
        parsed_entry = {
            'req_id': req_id,
            'start': start,
            'end': end,
            'latency': end - start,
            'time': entry['time'],
        }    
        parsed_data.append(parsed_entry)
    
    return pd.DataFrame(parsed_data)

def to_df_lambda(path):
    with open(path, 'r') as file:
        lines = file.readlines()
    parsed_data = []
    for line in lines:
        entry = json.loads(line)
        msg_parts = entry['msg'].split('##')
        req_id = msg_parts[0]  # Treat req_id as a string
        status = msg_parts[1]
        start = int(json.loads(msg_parts[2])['start'])
        result_data = json.loads(msg_parts[2])['result']
        end = int(json.loads(msg_parts[2])['end'])
        parsed_entry = {
            'req_id': req_id,
            'status': status,
            'start': start,
            'end': end,
            'latency': end - start,
            'time': entry['time'],
        }    
        parsed_data.append(parsed_entry)
    
    return pd.DataFrame(parsed_data)

def plot(df):
    if 'status' in df.columns:
        df = df.drop(columns=['req_id','start','end','status'])
    else:
        df = df.drop(columns=['req_id','start','end'])
    df['time'] = pd.to_datetime(df['time'])
    df['latency'] = pd.to_numeric(df['latency'], errors='coerce')
    df.set_index('time', inplace=True)
    df = df.resample('5min').mean() # Resampling = 1min
    
    plt.figure(figsize=(10, 6))
    plt.plot(df.index, df['latency'], linestyle='-', marker=None)
    plt.xlabel('Time')
    plt.ylabel('Latency (ms)')
    plt.title('Latency over Time')
    plt.xticks([])  # Hides the specific timestamp labels
    plt.tight_layout()
    plt.show()

def plot_multiple(dfs, labels):
    # Preprocess each DataFrame
    for i, df in enumerate(dfs):
        # Drop unnecessary columns
        if 'status' in df.columns:
            df = df.drop(columns=['req_id', 'start', 'end', 'status'])
        else:
            df = df.drop(columns=['req_id', 'start', 'end'])

        # Convert 'time' to datetime and 'latency' to numeric
        df['time'] = pd.to_datetime(df['time'],utc=True)
        df['latency'] = pd.to_numeric(df['latency'], errors='coerce')

        # Modify timestamps to start from zero
        min_time = df['time'].min()
        df['slided_time'] = (df['time'] - min_time).dt.total_seconds()
        
        # Set 'time' as the index and resample
        df.set_index('time', inplace=True)
        dfs[i] = df.resample('5min').mean()  # Adjust resampling frequency if needed

    # Plotting
    plt.figure(figsize=(12, 6))

    for df, label in zip(dfs, labels):
        # Plot the reindexed DataFrame
        plt.plot(df['slided_time'], df['latency'], label=label)

    plt.xlabel('Time')
    plt.ylabel('Latency (ms)')
    plt.title('Latency over Time')
    plt.xticks([])  # Rotate the timestamp labels for better readability
    plt.legend()  # Add a legend to distinguish DataFrames
    plt.tight_layout()
    plt.grid()
    plt.show()

def trim_df(df):
    lower_bound = int(len(df) * 0.025)  # Calculate 2.5% index
    upper_bound = int(len(df) * 0.975)  # Calculate 97.5% index
    return df.iloc[lower_bound:upper_bound]  # Slice the DataFrame

def summary(df, column_name):
    column = df[column_name]
    mean = column.mean()
    max_value = column.max()
    min_value = column.min()
    std_dev = column.std()
    variance = column.var()
    quantiles = column.quantile([0.25, 0.5, 0.75])  # 25th, 50th (median), and 75th percentiles
    print(f"Mean: {mean}")
    print(f"Max: {max_value}")
    print(f"Min: {min_value}")
    print(f"Standard Deviation: {std_dev}")
    print(f"Variance: {variance}")
    print("Quantiles:")
    print(quantiles)

def remove_outliers(df):
    three_sigma = 3*df['latency'].std()
    mean = df['latency'].mean()
    res_df = df[df['latency'] <= (mean+three_sigma)]
    stats = {
        'Metric': ['Min', 'Mean', 'Max'],
        'Value': [
            res_df['latency'].min(),
            res_df['latency'].mean(),
            res_df['latency'].max()
        ]
    }
    return (res_df,stats)

def final_plot(ec2_stats,lambda_stats):
    fig, (plot1, plot2) = plt.subplots(1, 2, figsize=(10, 5))

    sns.barplot(x='Metric', y='Value', data=ec2_stats, palette='viridis', ax=plot1)
    plot1.set_title("EC2")
    plot1.set_ylabel("Latency (ms)")
    plot1.set_xlabel("")
    for bar in range(0,3):
        plot1.bar_label(plot1.containers[bar], fontsize=10);
    plot1.yaxis.set_major_locator(MaxNLocator(integer=True))

    sns.barplot(x='Metric', y='Value', data=lambda_stats, palette='magma', ax=plot2)
    plot2.set_title("Lambda")
    plot2.set_ylabel("Latency (ms)")
    plot2.set_xlabel("")
    for bar in range(0,3):
        plot2.bar_label(plot2.containers[bar], fontsize=10);
    plot2.yaxis.set_major_locator(MaxNLocator(integer=True))
    
    plt.tight_layout()
    return fig
