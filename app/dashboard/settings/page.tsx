// app/dashboard/settings/page.tsx
"use client";

import * as React from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  User, Upload, Save, Shield, Bell, Palette, Link2, Lock, Trash2,
} from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

/* ----------------------------- Schemas ------------------------------ */

const ProfileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  bio: z.string().max(280, "Max 280 chars").optional(),
  website: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
});

const PrefSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
  locale: z.enum(["en", "hi", "fr", "de", "es"]),
  density: z.enum(["comfortable", "compact"]),
});

const NotifSchema = z.object({
  productUpdates: z.boolean(),
  weeklyDigest: z.boolean(),
  atsAlerts: z.boolean(),
  marketing: z.boolean(),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8, "Min 8 chars"),
    confirmNewPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

/* --------------------------- API types ------------------------------ */

type ProfileResp = {
  name: string;
  email: string;
  bio?: string | null;
  website?: string | null;
  avatar?: string | null;
};

type PrefResp = {
  theme: "system" | "light" | "dark";
  locale: "en" | "hi" | "fr" | "de" | "es";
  density: "comfortable" | "compact";
};

type NotifResp = z.infer<typeof NotifSchema>;

/* --------------------------- Helpers (API) --------------------------- */

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json().catch(() => ({}));
}

/* ----------------------------- Utils -------------------------------- */

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  const init = (first + second).toUpperCase();
  return init || "U";
}

/* ----------------------------- Page -------------------------------- */

export default function SettingsPage() {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>("");
  const [savingAvatar, setSavingAvatar] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  /* ------------------------- Forms setup -------------------------- */

  const profileForm = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      bio: "",
      website: "",
    },
  });

  const prefForm = useForm<z.infer<typeof PrefSchema>>({
    resolver: zodResolver(PrefSchema),
    defaultValues: {
      theme: "system",
      locale: "en",
      density: "comfortable",
    },
  });

  const notifForm = useForm<z.infer<typeof NotifSchema>>({
    resolver: zodResolver(NotifSchema),
    defaultValues: {
      productUpdates: true,
      weeklyDigest: true,
      atsAlerts: true,
      marketing: false,
    },
  });

  const pwdForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchedName = profileForm.watch("name");

  /* ---------------------- Initial data fetch ---------------------- */

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [profile, prefs, notif] = await Promise.all([
          getJSON<ProfileResp>("/api/settings/profile"),
          getJSON<PrefResp>("/api/settings/preferences"),
          getJSON<NotifResp>("/api/settings/notifications"),
        ]);

        if (cancelled) return;

        // Profile
        profileForm.reset({
          name: profile.name ?? "",
          bio: profile.bio ?? "",
          website: profile.website ?? "",
        });
        setEmail(profile.email ?? "");
        setAvatarUrl(profile.avatar ?? null);

        // Preferences
        prefForm.reset({
          theme: prefs.theme ?? "system",
          locale: prefs.locale ?? "en",
          density: prefs.density ?? "comfortable",
        });

        // Notifications
        notifForm.reset({
          productUpdates: !!notif.productUpdates,
          weeklyDigest: !!notif.weeklyDigest,
          atsAlerts: !!notif.atsAlerts,
          marketing: !!notif.marketing,
        });
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? "Failed to load settings");
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------ Submit handlers ----------------------- */

  const onSaveProfile = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      await postJSON("/api/settings/profile", values);
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update profile");
    }
  };

  const onSavePref = async (values: z.infer<typeof PrefSchema>) => {
    try {
      await postJSON("/api/settings/preferences", values);
      toast.success("Preferences saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save preferences");
    }
  };

  const onSaveNotif = async (values: z.infer<typeof NotifSchema>) => {
    try {
      await postJSON("/api/settings/notifications", values);
      toast.success("Notification settings saved");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save notifications");
    }
  };

  const onChangePassword = async (values: z.infer<typeof PasswordSchema>) => {
    try {
      await postJSON("/api/settings/password", values);
      toast.success("Password changed");
      pwdForm.reset();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to change password");
    }
  };

  const uploadAvatar = async (file?: File | null) => {
    if (!file) return;
    setSavingAvatar(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/settings/avatar", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!res.ok) throw new Error((await res.text()) || "Upload failed");
      const j = await res.json().catch(() => ({}));
      const url = j?.url || URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Avatar updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Avatar upload failed");
    } finally {
      setSavingAvatar(false);
    }
  };

  /* ----------------------------- UI ------------------------------- */

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile, preferences, and security.
          </p>
        </div>
        {initialLoading && (
          <span className="text-xs text-muted-foreground">Loading…</span>
        )}
      </div>

      <Separator className="my-4" />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: Avatar */}
            <Card className="lg:col-span-1 h-full">
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>JPG/PNG, square is best.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
                    <AvatarFallback>{getInitials(watchedName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avatar-file" className="sr-only">
                      Upload avatar
                    </Label>
                    <Input
                      id="avatar-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadAvatar(e.target.files?.[0])}
                      disabled={savingAvatar || initialLoading}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingAvatar || initialLoading}
                    >
                      <Upload
                        className={`mr-2 h-4 w-4 ${
                          savingAvatar ? "animate-pulse" : ""
                        }`}
                      />
                      {savingAvatar ? "Uploading…" : "Upload"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Profile form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  These details appear on shared resumes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={profileForm.handleSubmit(onSaveProfile)}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your full name"
                                disabled={initialLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input value={email} disabled />
                        <p className="text-xs text-muted-foreground">
                          Email is managed by your account provider.
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              {...field}
                              placeholder="Short intro (max 280 chars)"
                              disabled={initialLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="website"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://…"
                                disabled={initialLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-2">
                        <Label>Links</Label>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Link2 className="h-4 w-4" /> Add GitHub/LinkedIn from
                          your Resume editor.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button type="submit" disabled={initialLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Display</CardTitle>
                <CardDescription>
                  Theme and density preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...prefForm}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={prefForm.handleSubmit(onSavePref)}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                        <ModeToggle/>
                      <FormField
                        control={prefForm.control}
                        name="density"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Density</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={initialLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select density" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="comfortable">
                                    Comfortable
                                  </SelectItem>
                                  <SelectItem value="compact">Compact</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={prefForm.control}
                      name="locale"
                      render={({ field }: any) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={initialLoading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">
                                  हिन्दी (Hindi)
                                </SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-end">
                      <Button type="submit" disabled={initialLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save preferences
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional</CardTitle>
                <CardDescription>
                  Timezone & formatting (coming soon).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Timezone</Label>
                    <Input disabled value="Auto (browser)" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date format</Label>
                    <Input disabled value="Auto (locale)" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  These are auto-detected. You will be able to override soon.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notifForm}>
                <form
                  className="flex flex-col gap-6"
                  onSubmit={notifForm.handleSubmit(onSaveNotif)}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={notifForm.control}
                      name="productUpdates"
                      render={({ field }: any) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Bell className="h-4 w-4" /> Product updates
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Major features and improvements.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={initialLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notifForm.control}
                      name="weeklyDigest"
                      render={({ field }: any) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Weekly digest</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Summary of your activity.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={initialLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notifForm.control}
                      name="atsAlerts"
                      render={({ field }: any) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3 sm:col-span-2">
                          <div className="space-y-0.5">
                            <FormLabel>ATS alerts</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Get notified when ATS scores change.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={initialLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notifForm.control}
                      name="marketing"
                      render={({ field }: any) => (
                        <FormItem className="flex items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Tips & offers</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Occasional emails about promotions.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={initialLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    <Button type="submit" disabled={initialLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      Save notifications
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password for email/password accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...pwdForm}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={pwdForm.handleSubmit(onChangePassword)}
                  >
                    <div className="grid gap-4">
                      <FormField
                        control={pwdForm.control}
                        name="currentPassword"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                autoComplete="current-password"
                                {...field}
                                disabled={initialLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={pwdForm.control}
                          name="newPassword"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  autoComplete="new-password"
                                  {...field}
                                  disabled={initialLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={pwdForm.control}
                          name="confirmNewPassword"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>Confirm new password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  autoComplete="new-password"
                                  {...field}
                                  disabled={initialLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button type="submit" disabled={initialLoading}>
                        <Lock className="mr-2 h-4 w-4" />
                        Update password
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Delete your account and all related data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This action is irreversible. Please proceed with caution.
                </p>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!confirm("Are you sure? This cannot be undone.")) return;
                    try {
                      await postJSON("/api/settings/delete-account", {});
                      toast.success("Account deleted");
                      // window.location.href = "/goodbye";
                    } catch (e: any) {
                      toast.error(e?.message ?? "Failed to delete account");
                    }
                  }}
                  disabled={initialLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
