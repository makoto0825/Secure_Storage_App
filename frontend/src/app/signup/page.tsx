"use client";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/app/components/auth-layout";
import { Field, Label } from "@/app/components/fieldset";
import { Heading } from "@/app/components/heading";
import { Input } from "@/app/components/input";
import { Button } from "@/app/components/button";
import { Strong, Text, TextLink } from "@/app/components/text";
import { useState } from "react";
import { supabase } from "@/app/util/supabaseClient";

const SignUpPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // TODO: Call backend API for user registration.
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username, // To use in the frontend/backend operations
            fullName: username // To display in Supabase UI
          }
        }
      });

      if (error) {
        console.error("Signup error:", error.message);
        alert("Failed to register: " + error.message);
        return;
      }

      console.log("User registered:", data);
      alert("Check your email to verify your account.");
      router.push("/signin");

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong. Please try again later.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={register}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Register as a User</Heading>
        <Field>
          <Label>Username</Label>
          <Input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
        <Text>
          Already have an account?{" "}
          <TextLink href="/signin">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
