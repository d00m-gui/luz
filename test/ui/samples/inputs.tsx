import { lui } from "../../../src/components";
export function InputsSample() {
  return (
    <lui.card>
      <h2>inputs</h2>
      <div className="card-content">
        <form className="form">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="35"
            id="range"
            name="range"
          />
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Search"
          ></input>
          <input type="text" id="text" name="text" placeholder="Text"></input>
          <select id="select" name="select" required>
            <option>Select…</option>
            <option>…</option>
          </select>
          <input type="file" id="file" name="file" />
        </form>
      </div>
    </lui.card>
  );
}
