export const getTicketsElementContent = (
  isLoggedIn: boolean,
  roundOpen: boolean
) => {
  if (isLoggedIn) {
    if (roundOpen)
      return {
        href: `/tickets`,
        text: "Create New Ticket",
      };
    return {
      text: "All rounds are currently closed so no ticket can be created.",
    };
  }

  return { text: "Login to be able to create a ticket first." };
};
