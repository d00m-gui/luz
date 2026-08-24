function MeterSample() {
  return (
    <lui.card>
      <h2>meter</h2>
      <div className="card-content">
        <article>
          <lui.meter.root value={24}>
            <lui.meter.label className="label">
              <p>/home</p>
            </lui.meter.label>
            <lui.meter.value className="value" />
            <lui.meter.track className="track">
              <lui.meter.indicator className="indicator" />
            </lui.meter.track>
          </lui.meter.root>
        </article>
      </div>
    </lui.card>
  );
}

render(<MeterSample />);
