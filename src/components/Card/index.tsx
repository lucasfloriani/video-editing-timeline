import { Resizable, ResizeDirection } from "re-resizable";
import type { FC } from "react";
import { useDrag, useDrop } from "react-dnd";
import DragIconLeft from "../DragIconLeft";
import DragIconRight from "../DragIconRight";

import { ItemTypes } from "./ItemTypes";

export interface CardProps {
  id: string;
  size: number;
  text: string | null;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  resizeCard: (id: string, size: number, side: ResizeDirection) => void;
}

interface Item {
  id: string;
  originalIndex: number;
}

export const Card: FC<CardProps> = function Card({
  id,
  size,
  text,
  moveCard,
  findCard,
  resizeCard,
}) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );

  const opacity = isDragging ? 0.7 : 1;

  return (
    <Resizable
      minWidth={200}
      grid={[200, 1]}
      enable={{
        left: !!text,
        right: !!text,
      }}
      size={{
        height: 64,
        width: 200 * size,
      }}
      onResizeStop={(_1, side, elementRef) => {
        const newSize = Math.floor(elementRef.offsetWidth / 200);
        resizeCard(id, newSize, side);
      }}
      className="transition-all"
    >
      <div
        ref={(node) => drag(drop(node))}
        className="flex items-center gap-2 h-16 justify-between rounded-md bg-slate-700 text-white py-5 px-1"
        style={{ opacity }}
      >
        {text && <DragIconLeft />}
        <h5 className="text-center truncate text-ellipsis">{text}</h5>
        {text && <DragIconRight />}
      </div>
    </Resizable>
  );
};
