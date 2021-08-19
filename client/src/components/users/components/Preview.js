import React, { useState, useEffect } from 'react';

import LoadingSpinner from '../../shared/ui/LoadingSpinner';

export default function Preview({ file }) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState();
  useEffect(() => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoading(false);
        setThumb(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && thumb && (
        <img
          src={thumb}
          alt="user image"
          height={200}
          width={200}
          style={{ margin: '10px auto', display: 'block' }}
        />
      )}
      {!loading && !thumb && null}
    </>
  );
}
