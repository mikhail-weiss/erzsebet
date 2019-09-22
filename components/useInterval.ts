import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id;
    function tick() {
      if (savedCallback && savedCallback.current) {
        savedCallback.current();
        id = setTimeout(tick, delay);
      }
    }
    if (delay !== null) {
      return () => clearInterval(id);
    }
  }, [delay]);
}
