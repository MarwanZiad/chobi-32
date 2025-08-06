import { useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { User } from "@/types/user";
import { users as initialUsers } from "@/mocks/users";

export const [ChobiContext, useChobiStore] = createContextHook(() => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeContentTab, setActiveContentTab] = useState<string>("forYou");
  const [activeNavTab, setActiveNavTab] = useState<string>("home");

  const followUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isFollowing: true } : user
      )
    );
  };

  return {
    users,
    activeContentTab,
    activeNavTab,
    setActiveContentTab,
    setActiveNavTab,
    followUser,
  };
});