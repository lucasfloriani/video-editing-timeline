import { useCallback, useState } from "react";
import update from "immutability-helper";
import type { ResizeDirection } from "re-resizable";
import { Card } from "../Card";
import { ItemTypes } from "../Card/ItemTypes";
import { useDrop } from "react-dnd";

export interface ContainerState {
  cards: any[];
}

interface Item {
  id: number;
  text: string;
  size: number;
}

interface EmptyItem {
  id: number;
  text: null;
  size: number;
}

type Items = (Item | EmptyItem)[];

// const ITEMS: Items = [
//   {
//     id: 1,
//     text: "Write a cool JS library",
//     size: 1,
//   },
//   {
//     id: 2,
//     text: "Make it generic enough",
//     size: 1,
//   },
//   {
//     id: 3,
//     text: "Write README",
//     size: 1,
//   },
//   {
//     id: 4,
//     text: "Create some examples",
//     size: 1,
//   },
//   {
//     id: 5,
//     text: "Spam in Twitter and IRC to promote it",
//     size: 1,
//   },
//   {
//     id: 6,
//     text: "???",
//     size: 1,
//   },
// ];
const ITEMS: Items = [
  {
    id: 1,
    text: "Write a cool JS library",
    size: 1,
  },
  {
    id: 2,
    text: "Make it generic enough",
    size: 1,
  },
  {
    id: 3,
    text: null,
    size: 1,
  },
  {
    id: 4,
    text: "Create some examples",
    size: 1,
  },
  {
    id: 5,
    text: "Spam in Twitter and IRC to promote it",
    size: 1,
  },
  {
    id: 6,
    text: "???",
    size: 1,
  },
];

const Example = () => {
  const [cards, setCards] = useState<Items>(ITEMS);
  const itemsLength = cards.length;
  const maxSize = cards.length + 3;

  const findCard = useCallback(
    (id: string) => {
      const cardIndex = cards.findIndex((c) => `${c.id}` === id);
      return {
        card: cards[cardIndex],
        index: cardIndex,
      };
    },
    [cards]
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards]
  );

  const getCardsSize = useCallback((cards: Items): number => {
    return cards.reduce((acc, card) => acc + card.size, 0);
  }, []);

  const resizeCard = useCallback(
    (id: string, size: number, side: ResizeDirection) => {
      setCards((prevCards) => {
        const prevSizes = getCardsSize(prevCards);

        const cardIndex = prevCards.findIndex(
          (prevCard) => `${prevCard.id}` === id
        );
        const cardPrevSize = prevCards[cardIndex].size;

        const indexToRemove =
          side === "left"
            ? Math.max(cardIndex - 1, 0)
            : Math.min(cardIndex + 1, itemsLength - 1);
        const canBeRemoved =
          !prevCards[indexToRemove].text &&
          cardIndex !== indexToRemove &&
          cardPrevSize < size;

        const sizeWithoutCard = prevSizes - cardPrevSize;
        const newSize = sizeWithoutCard + size;
        const isSizeValid = (canBeRemoved ? newSize - 1 : newSize) <= maxSize;

        const transformedCards = prevCards.map((card) =>
          `${card.id}` === id
            ? { ...card, size: isSizeValid ? size : maxSize - sizeWithoutCard }
            : card
        );

        return canBeRemoved
          ? transformedCards.filter((_, index) => index !== indexToRemove)
          : transformedCards;
      });
    },
    [getCardsSize, itemsLength, maxSize]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <div className="w-screen h-screen flex justify-center items-end p-6">
      <div ref={drop} className="flex gap-3 w-screen">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={`${card.id}`}
            size={card.size}
            text={card.text}
            moveCard={moveCard}
            findCard={findCard}
            resizeCard={resizeCard}
          />
        ))}
      </div>
    </div>
  );
};

export default Example;
