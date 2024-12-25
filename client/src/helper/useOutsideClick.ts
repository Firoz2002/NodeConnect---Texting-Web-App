import {  useEffect } from 'react';

const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleMouseDownOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
    };
    const handleTouchStartOutside = (event: TouchEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            callback();
        }
    };

    document.addEventListener('mousedown', handleMouseDownOutside);
    document.addEventListener('touchstart', handleTouchStartOutside);

    return () => {
      document.removeEventListener('mousedown', handleMouseDownOutside);
      document.removeEventListener('touchstart', handleTouchStartOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;