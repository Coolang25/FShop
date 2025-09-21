import React, { useState } from 'react';
import Range from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Button } from 'react-bootstrap';

const PriceRangeFilter: React.FC = () => {
  const [range, setRange] = useState<number>(33);

  return (
    <div>
      <Range
        min={0}
        max={100}
        defaultValue={range}
        allowCross={false}
        onChange={(val: number) => {
          setRange(val);
        }}
        trackStyle={[{ backgroundColor: 'red', height: 6 }]}
        handleStyle={[
          { borderColor: 'red', height: 16, width: 16, marginTop: -6, backgroundColor: 'red' },
          { borderColor: 'red', height: 16, width: 16, marginTop: -6, backgroundColor: 'red' },
        ]}
        railStyle={{ backgroundColor: '#ddd', height: 6 }}
      />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <p className="mb-0">Price: $0 - ${range}</p>
        <Button variant="outline-danger">FILTER</Button>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
