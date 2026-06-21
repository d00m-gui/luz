import { lui } from "../../../dist/react";

export function GroupSample() {
  return (
    <lui.card>
      <h2>group</h2>
      <div className="card-content">
        <div role="group">
          <input name="email" type="email" placeholder="Enter your email" autoComplete="email" />
          <input type="submit" value="Subscribe" />
        </div>
      </div>
    </lui.card>
  );
}
