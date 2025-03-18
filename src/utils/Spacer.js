import React from 'react';
import PropTypes from 'prop-types';

/**
 * Adds spacing between components
 * 
 * @param {Object} props
 * @param {('xs'|'sm'|'md'|'lg'|'xl'|'2xl')} [props.size='md'] - Predefined size
 * @param {('horizontal'|'vertical')} [props.direction='vertical'] - Direction of spacing
 * @returns {JSX.Element}
 */
const Spacer = ({ size = 'md', direction = 'vertical' }) => {
  // Map size names to CSS variables from design system
  const sizeMap = {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    '2xl': 'var(--space-2xl)',
  };
  
  const style = {
    display: 'block',
    width: direction === 'horizontal' ? sizeMap[size] : 0,
    height: direction === 'vertical' ? sizeMap[size] : 0,
  };
  
  return <div style={style} aria-hidden="true" />;
};

Spacer.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default Spacer;