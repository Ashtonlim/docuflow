const SelectionBox = ({ coords }) => {
  console.log('add', coords)
  return (
    <div
      style={{
        position: 'absolute',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointerEvents: 'none',
        left: coords.pdfX,
        top: coords.domY,
        width: coords.width,
        height: coords.height,
      }}
    />
  )
}

export default SelectionBox
