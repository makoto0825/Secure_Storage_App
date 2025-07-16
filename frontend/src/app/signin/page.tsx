"use client";
import { AuthLayout } from "@/app/components/auth-layout";
import { Field, Label } from "@/app/components/fieldset";
import { Heading } from "@/app/components/heading";
import { Input } from "@/app/components/input";
import { Button } from "@/app/components/button";
import { Strong, Text, TextLink } from "@/app/components/text";
import { useState } from "react";

// Check the correct path
// import { supabase } from "@/lib/supabase";
import { supabase } from "../../../lib/supabaseClient";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Call backend API for user login.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    } else {
      console.log("User Login:", data);
      alert("Check your email to verify your account.");
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={signIn}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Sign In</Heading>
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
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <Text>
          Don&apos;t have an account?{" "}
          <TextLink href="/signup">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
};

export default SignInPage;
