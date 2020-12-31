import React from 'react'
import createReactClass from 'create-react-class'
import {
	SortableItemMixin
} from 'react-anything-sortable'

export default createReactClass({
	mixins: [SortableItemMixin],
	render() {
		const {
			children,
			conClassName,
		} = this.props;
		return this.renderWithSortable(
			<div className={conClassName}>
                {children}
            </div>
		);
	}
});