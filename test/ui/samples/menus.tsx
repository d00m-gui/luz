import { useState } from "react";
import { lui } from "../../../src/components";

export function MenusSample() {
  const [value, setValue] = useState("date");
  return (
    <lui.card>
      <h2>menu</h2>
      <div className="card-content">
        <lui.menu.root>
          <lui.menu.trigger>
            Sort by <code>{value}</code> <i className="nf nf-fa-sort" />
          </lui.menu.trigger>
          <lui.menu.portal>
            <lui.menu.positioner>
              <lui.menu.popup>
                <lui.menu.radiogroup value={value} onValueChange={setValue}>
                  <lui.menu.radioitem value="date">
                    <lui.menu.radioitemindicator className="indicator">
                      <i className="nf nf-fa-circle_check" />
                    </lui.menu.radioitemindicator>
                    <span>Date</span>
                  </lui.menu.radioitem>
                  <lui.menu.radioitem value="name">
                    <lui.menu.radioitemindicator className="indicator">
                      <i className="nf nf-fa-circle_check" />
                    </lui.menu.radioitemindicator>
                    <span>Name</span>
                  </lui.menu.radioitem>
                  <lui.menu.radioitem value="type">
                    <lui.menu.radioitemindicator className="indicator">
                      <i className="nf nf-fa-circle_check" />
                    </lui.menu.radioitemindicator>
                    <span>Type</span>
                  </lui.menu.radioitem>
                </lui.menu.radiogroup>
              </lui.menu.popup>
            </lui.menu.positioner>
          </lui.menu.portal>
        </lui.menu.root>
      </div>
    </lui.card>
  );
}
