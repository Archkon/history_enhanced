// Fetch and display history data
chrome.history.search({
  text: '',
  maxResults: 1000,
  startTime: 0
}, (historyItems) => {
  // Group by domain
  const groups = {};
  
  historyItems.forEach(item => {
    try {
      const url = new URL(item.url);
      const parts = url.hostname.split('.');
      const domain = parts.slice(-2).join('.');
      
      if (!groups[domain]) {
        groups[domain] = [];
      }
      groups[domain].push(item);
    } catch (e) {
      // Ignore invalid URLs
    }
  });

  // Remove loading indicator
  document.getElementById('loading').remove();
  const content = document.querySelector('.content');

  if (Object.keys(groups).length === 0) {
    const noData = document.createElement('div');
    noData.className = 'no-data';
    noData.textContent = 'No history data available';
    content.appendChild(noData);
    return;
  }

  // Setup search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.group').forEach(group => {
      const domain = group.querySelector('h3').textContent.toLowerCase();
      if (domain.includes(searchTerm)) {
        group.classList.remove('hidden');
        // If search matches, expand the group
        if (searchTerm) {
          const historyItems = group.querySelector('.history-items');
          historyItems.classList.remove('collapsed');
          group.querySelector('.group-toggle').textContent = '[-]';
        }
      } else {
        group.classList.add('hidden');
      }
    });
  });

  // Sort by item count and display groups
  Object.entries(groups)
    .sort(([, a], [, b]) => b.length - a.length)
    .forEach(([domain, items]) => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'group';

      const header = document.createElement('div');
      header.className = 'group-header';

      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.alignItems = 'center';

      const title = document.createElement('h3');
      title.textContent = domain;

      const toggle = document.createElement('span');
      toggle.className = 'group-toggle';
      toggle.textContent = '[-]';
      titleContainer.appendChild(title);
      titleContainer.appendChild(toggle);

      const count = document.createElement('span');
      count.className = 'group-count';
      count.textContent = `${items.length} items`;

      header.appendChild(titleContainer);
      header.appendChild(count);

      const historyItemsContainer = document.createElement('div');
      historyItemsContainer.className = 'history-items';

      // Add collapse/expand functionality
      header.addEventListener('click', () => {
        historyItemsContainer.classList.toggle('collapsed');
        toggle.textContent = historyItemsContainer.classList.contains('collapsed') ? '[+]' : '[-]';
      });

      items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';

        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title || item.url;
        link.target = '_blank';

        const time = document.createElement('span');
        time.className = 'time';
        time.textContent = new Date(item.lastVisitTime).toLocaleString();

        itemDiv.appendChild(link);
        itemDiv.appendChild(time);
        historyItemsContainer.appendChild(itemDiv);
      });

      groupDiv.appendChild(header);
      groupDiv.appendChild(historyItemsContainer);
      content.appendChild(groupDiv);
    });
});
