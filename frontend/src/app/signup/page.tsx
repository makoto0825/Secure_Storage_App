"use client";
import { AuthLayout } from "@/app/components/auth-layout";
import { Field, Label } from "@/app/components/fieldset";
import { Heading } from "@/app/components/heading";
import { Input } from "@/app/components/input";
import { Button } from "@/app/components/button";
import { Strong, Text, TextLink } from "@/app/components/text";
import { useState } from "react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Call backend API for user registration.
    console.log("User registered:", { email, password });
  };

  return (
    <AuthLayout>
      <form
        onSubmit={register}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Register as a User</Heading>
        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <Text>
          Already have an account?{" "}
          <TextLink href="signin">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
