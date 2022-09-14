import React from 'react';
import { pushItemObj } from '@/interface/screen';
import { getCorrectTextColor } from '@/utils/utils';
import './style.scss';

const SIZES: Record<string, string> = {
  small: '10px',
  normal: '12px',
  large: '14px',
  huge: '16px'
};
const StyledBullet: React.FC<pushItemObj> = ({
  msg,
  head,
  size = 'normal',
  color,
  backgroundColor = '#fff',
}: pushItemObj) => {
  const finalColor = color || getCorrectTextColor(backgroundColor);
  const fontSize = SIZES[size] || size;
  return (
    <div className='bullet-wrapper' style={{ backgroundColor, fontSize }}>
      {
        head && (
          <div className='bullet-head'>
            <img src={head} className='bullet-head-image' alt='msg head' />
          </div>
        )
      }
      <div className='bullet-msg' style={{ color: finalColor }}>{msg}</div>
    </div>
  );
};

export default StyledBullet;