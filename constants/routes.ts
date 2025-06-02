const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "sign-up",
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  ASK_QUESTION: "/ask-question",
  TAG: (id: string) => `/tags/${id}`,
};

export default ROUTES;
