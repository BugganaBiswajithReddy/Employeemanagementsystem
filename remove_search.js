const fs = require('fs');
let content = fs.readFileSync('src/components/ReportsModule.tsx', 'utf-8');

const searchInput = `            <input 
              type="text" 
              placeholder="Search by department..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto"
            />
`;
content = content.replace(searchInput, '');

fs.writeFileSync('src/components/ReportsModule.tsx', content);
