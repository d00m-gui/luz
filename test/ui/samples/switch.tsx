import { lui } from "../../../dist/react";
export function SwitchSample() {
  return (
    <lui.card>
      <h2>switches</h2>
      <nav className="card-content">
        <fieldset>
          <input type="checkbox" id="checkbox-1" name="checkbox-1" defaultChecked />
          <input type="checkbox" id="checkbox-2" name="checkbox-2" />
        </fieldset>

        <fieldset>
          <input type="radio" id="radio-1" name="radio" value="radio-1" defaultChecked />
          <input type="radio" id="radio-2" name="radio" value="radio-2" />
        </fieldset>

        <fieldset>
          <input type="checkbox" id="switch-1" name="switch-1" role="switch" defaultChecked />
          <input type="checkbox" id="switch-2" name="switch-2" role="switch" />
        </fieldset>
      </nav>
    </lui.card>
  );
}
