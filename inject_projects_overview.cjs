const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardModule.tsx', 'utf-8');

const projectOverviewUI = `
      {/* 1.5. Project Overview Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Project Overview</span>
          </h2>
          <span className="text-xs text-slate-500">Live Snapshot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {projectCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={card.id}
                className={\`p-4 rounded-xl border bg-white shadow-2xs transition-all hover:shadow-md flex flex-col justify-between\`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={\`p-2 rounded-lg \${card.iconBg}\`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {card.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Quick Actions Section */}`;

code = code.replace(
  `      </section>\n\n      {/* 2. Quick Actions Section */}`,
  `      </section>\n\n` + projectOverviewUI
);

fs.writeFileSync('src/components/DashboardModule.tsx', code);
