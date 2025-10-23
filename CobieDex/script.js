// ========================================
// CobieDex - Main JavaScript
// ========================================

// Configuration
const CONFIG = {
  COBIE_TOKEN_ADDRESS: '2NoFmB6ZvqRmqX4BYgQQ297oaYhuurKY9FtYj1mmbRMY',
  MIN_COBIE_REQUIRED: 1000,
  API_REFRESH_INTERVAL: 30000, // 30 seconds
};

// State Management
const state = {
  wallet: {
    connected: false,
    address: null,
    cobieBalance: 0,
  },
  filters: {
    tab: 'hot',
    age: 'all',
    minLiquidity: 5000,
    risk: 'all',
  },
  tokens: [],
  selectedToken: null,
};

// ========================================
// Utility Functions
// ========================================

function formatNumber(num) {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPercent(num) {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

function getRiskClass(score) {
  if (score >= 70) return 'safe';
  if (score >= 40) return 'medium';
  return 'danger';
}

function getRiskLabel(score) {
  if (score >= 70) return 'Safe';
  if (score >= 40) return 'Medium Risk';
  return 'High Risk';
}

function getRiskIcon(score) {
  if (score >= 70) return '🟢';
  if (score >= 40) return '🟡';
  return '🔴';
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Address copied to clipboard!', 'success');
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#6366f1'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========================================
// Wallet Functions
// ========================================

async function connectWallet() {
  try {
    // Simulate wallet connection (replace with actual Solana wallet adapter)
    const mockAddress = '0xABC...123';
    const mockBalance = 1234;
    
    state.wallet = {
      connected: true,
      address: mockAddress,
      cobieBalance: mockBalance,
    };
    
    updateWalletUI();
    showNotification('Wallet connected successfully!', 'success');
    
    // Check if user has enough COBIE
    if (mockBalance < CONFIG.MIN_COBIE_REQUIRED) {
      showAccessDenied();
    } else {
      showDashboard();
    }
  } catch (error) {
    console.error('Wallet connection failed:', error);
    showNotification('Failed to connect wallet', 'error');
  }
}

function disconnectWallet() {
  state.wallet = {
    connected: false,
    address: null,
    cobieBalance: 0,
  };
  updateWalletUI();
  showNotification('Wallet disconnected');
}

function updateWalletUI() {
  const walletBtn = document.getElementById('wallet-btn');
  const walletInfo = document.getElementById('wallet-info');
  
  if (state.wallet.connected) {
    if (walletBtn) walletBtn.style.display = 'none';
    if (walletInfo) {
      walletInfo.style.display = 'flex';
      walletInfo.innerHTML = `
        <div class="cobie-balance">
          🟣 <span>${state.wallet.cobieBalance.toLocaleString()} COBIE</span>
        </div>
        <span style="color: #64748b;">|</span>
        <span style="color: #94a3b8; font-size: 0.9rem;">${state.wallet.address}</span>
      `;
    }
  } else {
    if (walletBtn) walletBtn.style.display = 'block';
    if (walletInfo) walletInfo.style.display = 'none';
  }
}

// ========================================
// Token Data (Mock)
// ========================================

function generateMockTokens() {
  const tokens = [
    {
      id: 1,
      name: 'PEPE 3.0',
      address: '2NoF...mbRMY',
      price: 0.000034,
      change24h: 245.2,
      liquidity: 12543,
      holders: 342,
      volume24h: 45234,
      riskScore: 65,
      creatorHolding: 45,
      lpLocked: false,
      timestamp: Date.now() - 120000, // 2 min ago
      isNew: true,
      isPromoted: false,
    },
    {
      id: 2,
      name: 'DOGE 2.0',
      address: '3PqR...xyz',
      price: 0.000012,
      change24h: 89.3,
      liquidity: 8200,
      holders: 156,
      volume24h: 23100,
      riskScore: 35,
      creatorHolding: 52,
      lpLocked: false,
      timestamp: Date.now() - 300000, // 5 min ago
      isNew: true,
      isPromoted: false,
    },
    {
      id: 3,
      name: 'MOON SHOT',
      address: '4StU...abc',
      price: 0.002145,
      change24h: 156.7,
      liquidity: 125000,
      holders: 1234,
      volume24h: 234000,
      riskScore: 82,
      creatorHolding: 8,
      lpLocked: true,
      timestamp: Date.now() - 900000, // 15 min ago
      isNew: false,
      isPromoted: true,
    },
    {
      id: 4,
      name: 'SOL KING',
      address: '5VwX...def',
      price: 0.000567,
      change24h: -23.4,
      liquidity: 45000,
      holders: 678,
      volume24h: 89000,
      riskScore: 71,
      creatorHolding: 12,
      lpLocked: true,
      timestamp: Date.now() - 3600000, // 1 hour ago
      isNew: false,
      isPromoted: false,
    },
  ];
  
  state.tokens = tokens;
  return tokens;
}

// ========================================
// Filter Functions
// ========================================

function applyFilters() {
  let filtered = [...state.tokens];
  
  // Age filter
  if (state.filters.age === '<1h') {
    filtered = filtered.filter(t => (Date.now() - t.timestamp) < 3600000);
  } else if (state.filters.age === '<24h') {
    filtered = filtered.filter(t => (Date.now() - t.timestamp) < 86400000);
  }
  
  // Liquidity filter
  filtered = filtered.filter(t => t.liquidity >= state.filters.minLiquidity);
  
  // Risk filter
  if (state.filters.risk === 'safe') {
    filtered = filtered.filter(t => t.riskScore >= 70);
  } else if (state.filters.risk === 'medium') {
    filtered = filtered.filter(t => t.riskScore >= 40);
  }
  
  // Tab filter
  if (state.filters.tab === 'new') {
    filtered = filtered.filter(t => t.isNew);
  } else if (state.filters.tab === 'trending') {
    filtered = filtered.sort((a, b) => b.change24h - a.change24h);
  } else if (state.filters.tab === 'hot') {
    filtered = filtered.sort((a, b) => b.volume24h - a.volume24h);
  }
  
  return filtered;
}

function updateFilter(filterType, value) {
  state.filters[filterType] = value;
  
  // Update URL params
  const url = new URL(window.location);
  url.searchParams.set(filterType, value);
  window.history.pushState({}, '', url);
  
  // Re-render tokens
  renderTokenFeed();
}

// ========================================
// Render Functions
// ========================================

function renderTokenCard(token) {
  const cardClass = `token-card ${token.isNew ? 'new' : ''} ${token.isPromoted ? 'promoted' : ''}`;
  const changeClass = token.change24h >= 0 ? 'text-success' : 'text-danger';
  const changeIcon = token.change24h >= 0 ? '📈' : '📉';
  
  return `
    <div class="${cardClass}" onclick="openTokenDetail('${token.address}')">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
            ${token.isNew ? '<span class="badge badge-live"><span class="live-indicator"></span> LIVE</span>' : ''}
            ${token.isPromoted ? '<span class="badge badge-promoted">🎯 PROMOTED</span>' : ''}
            <h3 style="font-size: 1.5rem; font-weight: 700;">${token.name}</h3>
            <span style="color: #94a3b8; font-size: 0.9rem;">${getTimeAgo(token.timestamp)}</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 1.25rem; font-weight: 600;">$${token.price.toFixed(6)}</span>
            <span class="${changeClass}" style="font-weight: 600;">
              ${changeIcon} ${formatPercent(token.change24h)}
            </span>
          </div>
        </div>
        
        <div class="tooltip">
          <div class="risk-badge ${getRiskClass(token.riskScore)}">
            ${getRiskIcon(token.riskScore)} ${token.riskScore}
          </div>
          <span class="tooltip-text">Risk Score: ${getRiskLabel(token.riskScore)}</span>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div class="tooltip">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
            <span style="font-size: 1.2rem;">💧</span>
            <div>
              <div style="font-size: 0.8rem;">Liquidity</div>
              <div style="font-size: 1rem; font-weight: 600; color: #fff;">${formatNumber(token.liquidity)}</div>
            </div>
          </div>
          <span class="tooltip-text">Total liquidity locked in pools</span>
        </div>
        
        <div class="tooltip">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
            <span style="font-size: 1.2rem;">👥</span>
            <div>
              <div style="font-size: 0.8rem;">Holders</div>
              <div style="font-size: 1rem; font-weight: 600; color: #fff;">${token.holders.toLocaleString()}</div>
            </div>
          </div>
          <span class="tooltip-text">Total unique token holders</span>
        </div>
        
        <div class="tooltip">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
            <span style="font-size: 1.2rem;">📊</span>
            <div>
              <div style="font-size: 0.8rem;">24h Volume</div>
              <div style="font-size: 1rem; font-weight: 600; color: #fff;">${formatNumber(token.volume24h)}</div>
            </div>
          </div>
          <span class="tooltip-text">Trading volume in last 24 hours</span>
        </div>
        
        <div class="tooltip">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8;">
            <span style="font-size: 1.2rem;">🔒</span>
            <div>
              <div style="font-size: 0.8rem;">LP Status</div>
              <div style="font-size: 1rem; font-weight: 600; color: ${token.lpLocked ? '#10b981' : '#f59e0b'};">
                ${token.lpLocked ? '✅ Locked' : '⚠️ Not Locked'}
              </div>
            </div>
          </div>
          <span class="tooltip-text">${token.lpLocked ? 'Liquidity is locked' : 'Liquidity is NOT locked - HIGH RISK!'}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-primary" style="flex: 1;" onclick="event.stopPropagation(); openTokenDetail('${token.address}')">
          📊 View Full Analysis
        </button>
        <button class="btn btn-secondary" onclick="event.stopPropagation(); addToWatchlist('${token.address}')">
          ⭐ Watchlist
        </button>
      </div>
    </div>
  `;
}

function renderTokenFeed() {
  const feed = document.getElementById('token-feed');
  if (!feed) return;
  
  const filtered = applyFilters();
  
  if (filtered.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #94a3b8;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <div>No tokens match your filters</div>
      </div>
    `;
    return;
  }
  
  // Inject ad card every 3 tokens
  let html = '';
  filtered.forEach((token, index) => {
    html += renderTokenCard(token);
    
    // Add ad card
    if ((index + 1) % 3 === 0 && index < filtered.length - 1) {
      html += renderAdCard();
    }
  });
  
  feed.innerHTML = html;
}

function renderAdCard() {
  return `
    <div class="token-card promoted" style="border: 2px solid rgba(139, 92, 246, 0.8);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <span class="badge badge-promoted">🎯 SPONSORED</span>
        <span style="color: #64748b; font-size: 0.9rem;">Paid: 500 COBIE/day</span>
      </div>
      
      <div style="text-align: center; padding: 2rem;">
        <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">🚀 YOUR PROJECT HERE</h3>
        <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem;">
          Reach thousands of active Solana traders
        </p>
        
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" onclick="window.location.href='advertise.html'">
            Learn More
          </button>
          <button class="btn btn-secondary" onclick="window.location.href='advertise.html'">
            Advertise Now
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderTrendingCarousel() {
  const carousel = document.getElementById('trending-carousel');
  if (!carousel) return;
  
  const trending = state.tokens.slice(0, 3);
  
  const html = trending.map(token => `
    <div class="card" style="cursor: pointer; min-width: 280px;" onclick="openTokenDetail('${token.address}')">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <h4 style="font-weight: 700;">${token.name}</h4>
        <span class="risk-badge ${getRiskClass(token.riskScore)}" style="font-size: 0.8rem; padding: 0.25rem 0.75rem;">
          ${getRiskIcon(token.riskScore)} ${token.riskScore}
        </span>
      </div>
      <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
        $${token.price.toFixed(6)}
      </div>
      <div class="${token.change24h >= 0 ? 'text-success' : 'text-danger'}" style="font-weight: 600;">
        ${formatPercent(token.change24h)}
      </div>
    </div>
  `).join('');
  
  carousel.innerHTML = html;
}

// ========================================
// Navigation
// ========================================

function openTokenDetail(address) {
  window.location.href = `token-detail.html?address=${address}`;
}

function addToWatchlist(address) {
  showNotification(`${address} added to watchlist!`, 'success');
}

function showAccessDenied() {
  const content = document.getElementById('main-content');
  if (!content) return;
  
  content.innerHTML = `
    <div style="text-align: center; padding: 4rem; max-width: 500px; margin: 0 auto;">
      <div class="card">
        <div style="font-size: 4rem; margin-bottom: 1.5rem;">⚠️</div>
        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">
          Access Denied
        </h2>
        <p style="color: #94a3b8; margin-bottom: 1.5rem;">
          You need ${CONFIG.MIN_COBIE_REQUIRED.toLocaleString()} COBIE tokens to access CobieDex.
        </p>
        <p style="color: #94a3b8; margin-bottom: 2rem;">
          Your balance: <strong>${state.wallet.cobieBalance.toLocaleString()} COBIE</strong>
        </p>
        <button class="btn btn-primary w-full" onclick="window.open('https://raydium.io', '_blank')">
          Buy COBIE on Raydium
        </button>
      </div>
    </div>
  `;
}

function showDashboard() {
  // Redirect to dashboard
  window.location.href = 'dashboard.html';
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Generate mock data
  generateMockTokens();
  
  // Update wallet UI
  updateWalletUI();
  
  // Render components
  renderTokenFeed();
  renderTrendingCarousel();
  
  // Set up filter listeners
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      updateFilter('tab', e.target.dataset.tab);
    });
  });
  
  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', (e) => {
      updateFilter(e.target.dataset.filter, e.target.value);
    });
  });
  
  // Set up wallet button
  const walletBtn = document.getElementById('wallet-btn');
  if (walletBtn) {
    walletBtn.addEventListener('click', connectWallet);
  }
  
  // Auto-refresh tokens
  setInterval(() => {
    if (state.wallet.connected && state.wallet.cobieBalance >= CONFIG.MIN_COBIE_REQUIRED) {
      renderTokenFeed();
    }
  }, CONFIG.API_REFRESH_INTERVAL);
});

// Export functions for use in HTML
window.CobieDex = {
  connectWallet,
  disconnectWallet,
  openTokenDetail,
  addToWatchlist,
  copyToClipboard,
  formatNumber,
  formatPercent,
};
