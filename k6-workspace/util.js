export const spiky_stages = [
  { duration: '2h', target: 2 },  // Steady load at 2 rps
        
  // Spike 1
  { duration: '1m30s', target: 20 }, // Ramp up to 20 rps
  { duration: '1m30s', target: 2 },  // Ramp down to 2 rps

  { duration: '3m', target: 2 },  // Steady load at 2 rps
  
  // Spike 2
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 3
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 4
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 5
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 6
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 7
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 8
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 9
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 10
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 11
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 12
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 13
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 14
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 15
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 16
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 17
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 18
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 19
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 20
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 21
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 22
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 23
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 24
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 25
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 26
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 27
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 28
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 29
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '3m', target: 2 }, 

  // Spike 30
  { duration: '1m30s', target: 20 },
  { duration: '1m30s', target: 2 },

  { duration: '2h', target: 2 },  // End with steady load
];

export const spiky_stages_s3 = [
  {target: 1, duration: '20m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 80, duration: '15s'},
  {target: 1, duration: '15s'},
  {target: 1, duration: '6m'},
  {target: 1, duration: '10m'}
];