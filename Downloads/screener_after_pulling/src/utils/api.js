import { ENV_PROXY } from '@/configs/globalVariable';


function getToken() {
  const session = JSON.parse(localStorage.getItem("session"));
  console.log('session', session)
  if (!session) {
    return ;
  }
  return session.access_token
}

export function getUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user;
}


export function getMarket() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.market_preference;
}

export async function getStockData({ticker, exchange, uid}) {
    const token = getToken();
    let query = ''
    if (uid) {
      query = `?uid=${uid}`
    } else {
      query = `?ticker=${ticker}&exchange=${exchange}`
    }
    const response = await fetch(`${ENV_PROXY}/v3/ticker/data${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }


export async function getStrategiesForStock(data) {
    const token = getToken();
    const market = getMarket();
    const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function getStrategies(pageNumber) {
    const session = JSON.parse(localStorage.getItem("session"));
    const market = getMarket();
    console.log('session', session)
    const token = session.access_token
    const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/explore?page=${pageNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function getNews(ticker) {
    const token = getToken();
    const response = await fetch(`${ENV_PROXY}/v3/ticker/${ticker}/news`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function getStockDetails(ticker, exchange) {
    const token = getToken();
    const response = await fetch(`${ENV_PROXY}/v3/ticker/${ticker}/details?exchange=${exchange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


export async function getUserInfo() {
  const token = getToken();
  if (!token) {
    return
  }
  const response = await fetch(`${ENV_PROXY}/v3/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function createStrategy(strategy) {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({strategy})
  });

  if (response.status === 429) {
    // Handle the 429 error here
    // You can return the response JSON or throw an error, depending on your needs
    return response.json();
  }

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}



export async function fetchStrategy(strategy_id) {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/${strategy_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}


export async function deleteStrategy(strategy_id) {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/${strategy_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}


export async function backtestStrategy(strategy_id, tickers) {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({strategy_ids: [strategy_id], tickers: tickers})
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function getBacktestResults(strategy_id, pageNumber, searchTerm) {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy?page=${pageNumber}&search_term=${searchTerm}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({strategy_ids: [strategy_id]}),
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}

// Fetch typeahead results
export async function searchStrategy(query) {
  try {
    const token = getToken();
    const market = getMarket();
    const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/lookup?q=${query}`, {method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }});
    const data = await response.json();
    return data;  // Modify according to your API's response structure
  } catch (error) {
      console.error("Error fetching typeahead results:", error);
      return [];
  }
}


export const getStrategyResult = async (ticker, strategy_id) => {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/${strategy_id}/backtest_results/${ticker}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json()
}

// Fetch typeahead results
export async function fetchTypeaheadResults(query) {
  try {
    const token = getToken();
    const user = getUser();
    const response = await fetch(`${ENV_PROXY}/v3/ticker/search?q=${query}&market=${user.market_preference}`, {method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }});
    const data = await response.json();
    return data;  // Modify according to your API's response structure
  } catch (error) {
      console.error("Error fetching typeahead results:", error);
      return [];
  }
}


export async function fetchStrategies() {
  const token = getToken();
  const market = getMarket();
  const response = await fetch(`${ENV_PROXY}/v3/${market}/strategy/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function fetchIndexPerformance(ticker_uid, start_date, end_date) {
  const token = getToken();
  const response = await fetch(`${ENV_PROXY}/v3/ticker/performance?ticker_uid=${ticker_uid}&start_date=${start_date}&end_date=${end_date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return response.json();
}


export async function adduser(body) {
  const token = getToken();
  const response = await fetch(`${ENV_PROXY}/v3/users/add`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
