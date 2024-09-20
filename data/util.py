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

def plot(df, time_column, latency_column):
    plt.figure(figsize=(10, 6))
    plt.plot(df[time_column], df[latency_column], linestyle='-', marker=None)
    plt.xlabel('Time')
    plt.ylabel('Latency (ms)')
    plt.title('Latency over Time')
    plt.xticks([])  # Hides the specific timestamp labels
    plt.tight_layout()
    plt.show()    
