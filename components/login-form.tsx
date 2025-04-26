"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="login">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="font-bold text-2xl">
              <span className="text-primary">Crypto</span>
              <span>Market</span>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="login">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="name@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input id="password-register" type="password" placeholder="••••••••" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-sm text-muted-foreground mt-2">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  )
}
