function ToggleSample() {
  return (
    <lui.card>
      <h2>toggle</h2>
      <div className="card-content">
        <lui.toggle aria-label="Bold" value="bold">
          B
        </lui.toggle>
      </div>
    </lui.card>
  );
}

render(<ToggleSample />);
