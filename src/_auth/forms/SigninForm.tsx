import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  type formFields = z.infer<typeof SigninValidation>;

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  const {
    checkAuthUser,
    isLoading: isUserLoading,
    isAuthenticated,
  } = useAuthContext();
  const form = useForm<formFields>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (user: formFields) => {
    try {
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });
      console.log(session);

      if (!session) {
        toast({
          title: "Sign In failed. Please try again.",
        });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      console.log(isLoggedIn);
      console.log(isAuthenticated);

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Signup failed. Please try again" });
        return;
      }
    } catch (error) {
      throw error;
    }
  };
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back, Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="flex flex-col gap-6 w-full mt-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email
                  "
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-primary-500 " />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-primary-500 " />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isPending ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign-in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
