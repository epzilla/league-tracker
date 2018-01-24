const SelectList = ({ className, items, selectedItems, renderItem, callback }) => {
  return (
    <ul class={className + ' select-list'}>
      {
        items.map(item => {
          let highlighted = selectedItems.indexOf(item) !== -1;
          return (
            <li class={highlighted ? 'highlighted' : null} onClick={() => callback(item)}>{renderItem(item, highlighted)}</li>
          )
        })
      }
    </ul>
  );
};

export default SelectList;