import { rounds, tickets } from "../db/schema";

export const getDrawnNumbersMessage = (
  ticket: typeof tickets.$inferSelect & {
    rounds: typeof rounds.$inferSelect | null;
  }
) => {
  if (!ticket.rounds?.closedAt) {
    return {
      drawnNumbersMessage: "The round is not closed yet.",
      resultsMessage: "",
    };
  }

  if (ticket.rounds?.closedAt && !ticket.rounds?.drawnNumbers) {
    return {
      drawnNumbersMessage:
        "The round is closed but the numbers haven't been drawn yet.",
      resultsMessage: "",
    };
  }

  const drawnNumbers = ticket.rounds.drawnNumbers ?? [];

  const areDrawnAndTicketNumbersSame = ticket.numbers.every((tn) =>
    drawnNumbers.includes(tn)
  );

  const resultMessage = areDrawnAndTicketNumbersSame
    ? "Congrats! Yours and drawn numbers match."
    : "Better luck with the next ticket.";

  return {
    drawnNumbersMessage: `The drawn numbers for this round: ${drawnNumbers}`,
    resultMessage,
  };
};
