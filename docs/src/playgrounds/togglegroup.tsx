function ToggleGroupSample() {
  return (
    <lui.card>
      <h2>togglegroup</h2>
      <div className="card-content">
        <lui.togglegroup defaultValue={["left"]}>
          <lui.toggle aria-label="Align left" value="left">
            L
          </lui.toggle>
          <lui.toggle aria-label="Align center" value="center">
            C
          </lui.toggle>
          <lui.toggle aria-label="Align right" value="right">
            R
          </lui.toggle>
        </lui.togglegroup>
      </div>
    </lui.card>
  );
}

render(<ToggleGroupSample />);
