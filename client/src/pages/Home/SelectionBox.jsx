const SelectionBox = ({ coords }) => {
  console.log('add', coords)
  return (
    <div
      style={{
        position: 'absolute',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointerEvents: 'none',
        left: coords.topx,
        top: coords.topy,
        width: coords.width,
        height: coords.height,
      }}
    />
  )
}

export default SelectionBox
