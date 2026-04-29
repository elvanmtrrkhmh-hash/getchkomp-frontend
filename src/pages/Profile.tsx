import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { customer, isLoading, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    phone_number: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch user profile saat page load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!customer) {
        navigate("/login");
        return;
      }

      try {
        // Fetch latest profile data dari API
        const result = await authService.getCurrentUser();
        if (result.customer) {
          setFormData({
            fullName: result.customer.fullName || "",
            phone_number: result.customer.phone_number || result.customer.phone || "",
            address: result.customer.address || "",
            city: result.customer.city || "",
            province: result.customer.province || "",
            postalCode: result.customer.postalCode || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback ke customer dari state
        if (customer) {
          setFormData({
            fullName: customer.fullName || "",
            phone_number: customer.phone_number || customer.phone || "",
            address: customer.address || "",
            city: customer.city || "",
            province: customer.province || "",
            postalCode: customer.postalCode || "",
          });
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [customer, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      toast({
        title: t("common.success"),
        description: t("profile.update_success"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("profile.update_fail"),
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: t("profile.logout_success"),
      description: t("profile.logout_desc"),
    });
    navigate("/");
  };

  if (!customer) {
    return null;
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p className="mt-4 text-muted-foreground">{t("profile.loading")}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="container max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {t("profile.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("profile.desc")}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-center text-foreground">
                    {customer.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {customer.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      {t("profile.personal_info")}
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("auth.name")}
                          </label>
                          <Input
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("checkout.phone")}
                          </label>
                          <Input
                            name="phone_number"
                            type="tel"
                            value={formData.phone_number}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {t("auth.email")}
                        </label>
                        <Input
                          type="email"
                          value={customer.email}
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                          {t("profile.email_locked")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t"></div>

                  {/* Address Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      {t("checkout.shipping_address")}
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          {t("checkout.address")}
                        </label>
                        <Input
                          name="address"
                          type="text"
                          placeholder="Jl. Merdeka No. 123"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("checkout.city")}
                          </label>
                          <Input
                            name="city"
                            type="text"
                            placeholder="Jakarta"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("profile.province")}
                          </label>
                          <Input
                            name="province"
                            type="text"
                            placeholder="DKI Jakarta"
                            value={formData.province}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">
                            {t("checkout.postal_code")}
                          </label>
                          <Input
                            name="postalCode"
                            type="text"
                            placeholder="12345"
                            value={formData.postalCode}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t"></div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLogout}
                      className="text-destructive hover:text-destructive"
                    >
                      {t("navbar.logout")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? t("profile.saving") : t("profile.save_changes")}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
