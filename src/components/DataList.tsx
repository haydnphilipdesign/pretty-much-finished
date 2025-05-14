function DataList() {
  // Use callback for stable event handler references
  const handleItemClick = useCallback((id: string) => {
    // handle click
  }, []); 

  // Batch related state updates
  const handleBatchUpdate = () => {
    setBatchedState(prev => ({
      ...prev,
      field1: newValue1,
      field2: newValue2
    }));
  };

  return (
    <div>
      {items.map(item => (
        <Item 
          key={item.id}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
} 