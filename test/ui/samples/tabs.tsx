import { lui } from "../../../src/components";
export function TabsSample() {
  return (
    <lui.card>
      <h2>tabs</h2>
      <lui.tabs.root className="tabs">
        <lui.tabs.list className="list">
          <lui.tabs.tab value="overview" className="tab">
            Overview
          </lui.tabs.tab>
          <lui.tabs.tab value="components" className="tab">
            Components
          </lui.tabs.tab>
        </lui.tabs.list>
        <lui.tabs.panel value="overview" className="panel">
          <article>
            <h3>Overview</h3>
            <p>Vitae congue turpis hendrerit non.</p>
          </article>
        </lui.tabs.panel>
        <lui.tabs.panel value="components" className="panel">
          <article>
            <h3>Components</h3>
            <p>Vivamus porta nunc a erat mattis.</p>
          </article>
        </lui.tabs.panel>
      </lui.tabs.root>
    </lui.card>
  );
}
