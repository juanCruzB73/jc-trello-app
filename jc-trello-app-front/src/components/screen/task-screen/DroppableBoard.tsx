import { useDroppable } from '@dnd-kit/core';


// Create a Droppable Board Component
export const DroppableBoard = ({ id, title, children, styles }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div className={styles.taskScreenBoard}>
      <h2>{title}</h2>
      <div 
        ref={setNodeRef}
        className={styles.taskScreenCardContainer}
        style={{
          backgroundColor: isOver ? 'rgba(42, 63, 95, 0.3)' : 'transparent',
          transition: 'background-color 0.2s',
          borderRadius: '0.5rem',
          minHeight: '200px'
        }}
      >
        {children}
      </div>
    </div>
  );
};