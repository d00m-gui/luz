import { lui } from "../../../dist/react";
export function ToggleSample() {
  return (
    <lui.card>
      <h2>toggle</h2>
      <div className="card-content">
        <lui.togglegroup defaultValue={["left"]}>
          <lui.toggle aria-label="Align left" value="left">
            <i className="nf nf-md-format_bold" />
          </lui.toggle>
          <lui.toggle aria-label="Align center" value="center">
            <i className="nf nf-md-format_italic" />
          </lui.toggle>
          <lui.toggle aria-label="Align right" value="right">
            <i className="nf nf-md-format_underline" />
          </lui.toggle>
        </lui.togglegroup>
      </div>
    </lui.card>
  );
}
