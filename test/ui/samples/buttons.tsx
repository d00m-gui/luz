import { useState } from "react";
import { lui } from "../../../src/components";

export function ButtonsSample() {
  const [loading, setLoading] = useState(false);
  return (
    <lui.card className="card buttons">
      <h2>buttons</h2>
      <div className="card-content">
        <div role="group">
          <lui.button
            disabled={loading}
            focusableWhenDisabled
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 500);
            }}
          >
            {loading ? "Submitting" : "Button"}
          </lui.button>
          <lui.button className="success">Success</lui.button>
          <lui.button className="contrast">Contrast</lui.button>
        </div>
        <div role="group">
          <lui.button className="over">Over</lui.button>
          <lui.button className="danger">Danger</lui.button>
          <lui.button className="reset">Reset</lui.button>
        </div>
        <div role="group">
          <lui.button className="pressed">Pressed</lui.button>
          <lui.button className="warning">Warning</lui.button>
          <lui.button className="ghost">Ghost</lui.button>
        </div>
      </div>
    </lui.card>
  );
}
