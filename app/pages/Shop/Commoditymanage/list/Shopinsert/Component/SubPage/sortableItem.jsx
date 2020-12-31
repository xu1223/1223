import React from 'react'
import createReactClass from 'create-react-class'
import {
	SortableItemMixin
} from 'react-anything-sortable'
export default createReactClass({
    mixins: [SortableItemMixin],
    getDefaultProps() {
      return {
        className: 'demo-item'
      };
    },
  
    render() {
      const { className, children } = this.props;
      return this.renderWithSortable(
        <div className={className}>
          {children}
        </div>
      );
    }
  });