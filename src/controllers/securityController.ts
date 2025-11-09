import { Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "../db";
import { loginIps, users } from "../db/schema";
import {
  checkIfTimeoutPassed,
  hashPassword,
  isPasswordValid,
  queryForUsername,
} from "../utils/security.utils";
import { eq } from "drizzle-orm";

dotenv.config();

export const renderSecurity = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.render("security", {
    username: null,
    password: null,
    sqlInjectionSwitch: null,
    brokenAuthenticationSwitch: null,
    badAuthSectionMessage: null,
    badAuthUser: null,
  });
};

export const submitUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, sqlInjectionSwitch } = req.body;

  const queryResult = await queryForUsername(username, !!sqlInjectionSwitch);

  res.status(200).render("security", {
    username: queryResult.length > 0 ? JSON.stringify(queryResult) : "Unknown",
    sqlInjectionSwitch,
    password: null,
    brokenAuthenticationSwitch: null,
    badAuthUser: null,
    badAuthSectionMessage: null,
  });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Username or password not good.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({ username, password: hashedPassword });

  res.status(201).send("New user created.");
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password, brokenAuthenticationSwitch } = req.body;

  if (!!brokenAuthenticationSwitch) {
    if (!username) {
      res.status(200).render("security", {
        username: null,
        sqlInjectionSwitch: null,
        password: null,
        brokenAuthenticationSwitch,
        badAuthUser: null,
        badAuthSectionMessage: "Username not provided.",
      });
      return;
    } else if (!password) {
      res.status(200).render("security", {
        username: null,
        sqlInjectionSwitch: null,
        password: null,
        brokenAuthenticationSwitch,
        badAuthUser: null,
        badAuthSectionMessage: "Password not provided.",
      });
      return;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      res.status(200).render("security", {
        username: null,
        sqlInjectionSwitch: null,
        password: null,
        brokenAuthenticationSwitch,
        badAuthUser: null,
        badAuthSectionMessage: "Username invalid.",
      });
      return;
    }

    const passwordValid = await isPasswordValid(password, user.password);

    if (!passwordValid) {
      res.status(200).render("security", {
        username: null,
        sqlInjectionSwitch: null,
        password: null,
        brokenAuthenticationSwitch,
        badAuthUser: null,
        badAuthSectionMessage: "Password invalid.",
      });
      return;
    }

    res.status(200).render("security", {
      username: null,
      sqlInjectionSwitch: null,
      password: null,
      brokenAuthenticationSwitch,
      badAuthUser: JSON.stringify(user),
      badAuthSectionMessage: "Successfuly authenticated.",
    });
    return;
  }

  const { ip } = req;
  let loginIp: typeof loginIps.$inferSelect | undefined | null =
    await db.query.loginIps.findFirst({
      where: eq(loginIps.ipAddress, ip!),
    });

  if (loginIp?.failedTries === 5) {
    const hasTimeoutPassed = checkIfTimeoutPassed(loginIp);
    if (hasTimeoutPassed) {
      await db
        .delete(loginIps)
        .where(eq(loginIps.ipAddress, loginIp.ipAddress));
      loginIp = null;
    } else {
      res.status(200).render("security", {
        username: null,
        sqlInjectionSwitch: null,
        password: null,
        brokenAuthenticationSwitch: null,
        badAuthUser: null,
        badAuthSectionMessage: "You are blocked from trying for a minut.",
      });
      return;
    }
  }

  if (!username || !password) {
    res.status(200).render("security", {
      username: null,
      sqlInjectionSwitch: null,
      password: null,
      brokenAuthenticationSwitch: null,
      badAuthUser: null,
      badAuthSectionMessage: "Username or password not provided.",
    });
    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    res.status(200).render("security", {
      username: null,
      sqlInjectionSwitch: null,
      password: null,
      brokenAuthenticationSwitch: null,
      badAuthUser: null,
      badAuthSectionMessage: "Username or password invalid.",
    });
    return;
  }

  const passwordValid = await isPasswordValid(password, user.password);

  if (!passwordValid) {
    if (!loginIp) {
      await db.insert(loginIps).values({
        ipAddress: ip!,
        failedTries: 1,
      });
    } else {
      if (loginIp.failedTries >= 4) {
        await db
          .update(loginIps)
          .set({
            failedTries: 5,
            blockedAt: Number(Date.now()),
          })
          .where(eq(loginIps.ipAddress, loginIp.ipAddress));
      } else {
        await db
          .update(loginIps)
          .set({ failedTries: loginIp.failedTries + 1 })
          .where(eq(loginIps.ipAddress, loginIp.ipAddress));
      }
    }

    res.status(200).render("security", {
      username: null,
      sqlInjectionSwitch: null,
      password: null,
      brokenAuthenticationSwitch: null,
      badAuthUser: null,
      badAuthSectionMessage: "Username or password invalid.",
    });
    return;
  }

  if (loginIp) {
    await db.delete(loginIps).where(eq(loginIps.ipAddress, loginIp.ipAddress));
  }

  res.status(200).render("security", {
    username: null,
    sqlInjectionSwitch: null,
    password: null,
    brokenAuthenticationSwitch: null,
    badAuthUser: JSON.stringify(user),
    badAuthSectionMessage: "Successfuly authenticated.",
  });
};
