const getRoleHome = (role) => {
  switch (role) {
    case "admin":
      return "/admin";

    case "owner":
      return "/business";

    case "customer":
    default:
      return "/";
  }
};

export default getRoleHome;