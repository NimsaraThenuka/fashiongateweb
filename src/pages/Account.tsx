import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
  Calendar,
  Truck,
  CheckCircle2,
  Search,
  FileText,
  AlertCircle,
  ShieldCheck,
  Camera,
  Save,
  Check,
  Upload,
  Trash2,
  Link2,
  X,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import type { CustomerAddress, CustomerUser } from '../types/order';

const SRI_LANKA_PROVINCES = [
  'Western Province (Colombo, Gampaha, Kalutara)',
  'Central Province (Kandy, Matale, Nuwara Eliya)',
  'Southern Province (Galle, Matara, Hambantota)',
  'North Western Province (Kurunegala, Puttalam)',
  'Western Province - Colombo Suburbs',
  'Sabaragamuwa Province (Ratnapura, Kegalle)',
  'Eastern Province (Trincomalee, Batticaloa, Ampara)',
  'North Central Province (Anuradhapura, Polonnaruwa)',
  'Northern Province (Jaffna, Kilinochchi, Mannar)',
  'Uva Province (Badulla, Monaragala)',
];

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const GoogleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, signInWithGoogle, signOut, updateSavedAddress, updateProfile } = useCustomerAuth();
  const { getCustomerOrders } = useOrders();
  const { items: wishlistItems = [], toggleWishlist } = useWishlist();

  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Profile Edit Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileGender, setProfileGender] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileSize, setProfileSize] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [photoSavedToast, setPhotoSavedToast] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  // Live Camera Studio State
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // File input refs for gallery & camera capture
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Address Form State
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrProvince, setAddrProvince] = useState(SRI_LANKA_PROVINCES[0]);
  const [addressSavedToast, setAddressSavedToast] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Lightbox modal for slip preview
  const [slipModalUrl, setSlipModalUrl] = useState<string | null>(null);

  // Populate profile and address form from user state
  useEffect(() => {
    if (user) {
      setProfileName(user.displayName || '');
      setProfilePhone(user.phoneNumber || '');
      setProfilePhoto(user.photoURL || '');
      setProfileGender(user.gender || '');
      setProfileDob(user.dateOfBirth || '');
      setProfileSize(user.preferredSize || '');
      setProfileBio(user.bio || '');

      if (user.defaultAddress) {
        setAddrFullName(user.defaultAddress.fullName || user.displayName || '');
        setAddrPhone(user.defaultAddress.phone || user.phoneNumber || '');
        setAddrStreet(user.defaultAddress.address || '');
        setAddrCity(user.defaultAddress.city || '');
        setAddrPostalCode(user.defaultAddress.postalCode || '');
        setAddrProvince(user.defaultAddress.province || SRI_LANKA_PROVINCES[0]);
      } else {
        setAddrFullName(user.displayName || '');
        setAddrPhone(user.phoneNumber || '');
      }
    }
  }, [user]);

  const customerOrders = user ? getCustomerOrders(user.uid, user.email) : [];

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Process & compress uploaded image, then auto-sync to user profile
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const raw = event.target?.result as string;

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 400; // Optimal luxury avatar resolution
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setProfilePhoto(compressed);
            if (user) {
              updateProfile({ photoURL: compressed });
              setPhotoSavedToast(true);
              setTimeout(() => setPhotoSavedToast(false), 3500);
            }
          } else {
            setProfilePhoto(raw);
            if (user) {
              updateProfile({ photoURL: raw });
              setPhotoSavedToast(true);
              setTimeout(() => setPhotoSavedToast(false), 3500);
            }
          }
          setPhotoUploading(false);
        };
        img.onerror = () => {
          setProfilePhoto(raw);
          if (user) {
            updateProfile({ photoURL: raw });
            setPhotoSavedToast(true);
            setTimeout(() => setPhotoSavedToast(false), 3500);
          }
          setPhotoUploading(false);
        };
        img.src = raw;
      } else {
        setProfilePhoto(raw);
        if (user) {
          updateProfile({ photoURL: raw });
          setPhotoSavedToast(true);
          setTimeout(() => setPhotoSavedToast(false), 3500);
        }
        setPhotoUploading(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset file inputs so the same photo can be re-selected if desired
    if (e.target) e.target.value = '';
  };

  // Remove photo (reverts to monogram)
  const handleRemovePhoto = async () => {
    setProfilePhoto('');
    if (user) {
      await updateProfile({ photoURL: '' });
      setPhotoSavedToast(true);
      setTimeout(() => setPhotoSavedToast(false), 3500);
    }
  };

  // Apply custom image URL
  const handleApplyUrlPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInputValue.trim()) return;
    const cleanUrl = urlInputValue.trim();
    setProfilePhoto(cleanUrl);
    if (user) {
      await updateProfile({ photoURL: cleanUrl });
      setPhotoSavedToast(true);
      setTimeout(() => setPhotoSavedToast(false), 3500);
    }
    setUrlInputValue('');
    setUrlInputOpen(false);
  };

  // --- LIVE DEVICE CAMERA HANDLERS ---
  const startCameraStream = async (facing: 'user' | 'environment' = 'user') => {
    setCameraError(null);
    setCapturedPhoto(null);

    // Stop existing stream if any
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Direct webcam stream is not supported in this environment. Please use device camera app.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => { });
      }
    } catch (err: any) {
      console.warn('Camera stream could not start:', err);
      setCameraError(err.message || 'Camera permission was denied or camera is not available.');
    }
  };

  const handleOpenLiveCamera = () => {
    setCameraModalOpen(true);
    startCameraStream(cameraFacing);
  };

  const handleCloseCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraModalOpen(false);
    setCapturedPhoto(null);
    setCameraError(null);
  };

  const handleFlipCamera = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCameraStream(nextFacing);
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const w = video.videoWidth || 480;
    const h = video.videoHeight || 480;
    const size = Math.min(w, h);

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image for front selfie camera
      if (cameraFacing === 'user') {
        ctx.translate(400, 0);
        ctx.scale(-1, 1);
      }
      const sx = (w - size) / 2;
      const sy = (h - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleConfirmCapturedPhoto = async () => {
    if (!capturedPhoto) return;
    setProfilePhoto(capturedPhoto);
    if (user) {
      await updateProfile({ photoURL: capturedPhoto });
      setPhotoSavedToast(true);
      setTimeout(() => setPhotoSavedToast(false), 3500);
    }
    handleCloseCameraModal();
  };

  // Sync camera video stream on modal mount
  useEffect(() => {
    if (cameraModalOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => { });
    }
  }, [cameraModalOpen, cameraStream]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileSaving(true);
    const updatedAddress = user.defaultAddress
      ? {
        ...user.defaultAddress,
        fullName: profileName.trim() || user.defaultAddress.fullName,
        phone: profilePhone.trim() || user.defaultAddress.phone,
      }
      : undefined;

    const updates: Partial<CustomerUser> = {
      displayName: profileName.trim() || user.displayName,
      phoneNumber: profilePhone.trim(),
      photoURL: profilePhoto.trim(),
      gender: profileGender || undefined,
      dateOfBirth: profileDob || undefined,
      preferredSize: profileSize || undefined,
      bio: profileBio.trim() || undefined,
      ...(updatedAddress ? { defaultAddress: updatedAddress } : {}),
    };

    await updateProfile(updates);
    setProfileSaving(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3500);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSavingAddress(true);
    const newAddress: CustomerAddress = {
      fullName: addrFullName.trim() || profileName.trim() || user.displayName || 'Valued Customer',
      phone: addrPhone.trim() || profilePhone.trim() || user.phoneNumber || '',
      address: addrStreet.trim(),
      city: addrCity.trim(),
      postalCode: addrPostalCode.trim(),
      province: addrProvince,
    };

    await updateSavedAddress(newAddress);
    if (addrFullName.trim() || addrPhone.trim()) {
      await updateProfile({
        displayName: addrFullName.trim() || user.displayName || undefined,
        phoneNumber: addrPhone.trim() || user.phoneNumber || undefined,
      });
    }
    setSavingAddress(false);
    setAddressSavedToast(true);
    setTimeout(() => setAddressSavedToast(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-300';
    }
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Fashion Gate Patron';
  const userInitials = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();
  const userJoinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '2026';

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 md:pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#9E9E9E] tracking-[0.08em] uppercase mb-4 sm:mb-6">
          <Link to="/" className="hover:text-[#C4922A] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#0A0A0A] font-semibold">Client Account</span>
        </div>

        {!user ? (
          /* GUEST SIGN-IN HERO */
          <div className="max-w-xl mx-auto my-4 sm:my-10 bg-white border border-[#E8E4DF] rounded-sm p-5 sm:p-10 shadow-xs text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAFAF8] border border-[#E8E4DF] flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-inner">
              <User size={26} className="text-[#C4922A]" />
            </div>

            <p className="text-[10px] sm:text-xs text-[#C4922A] tracking-[0.2em] uppercase font-mono font-bold mb-1.5">
              Fashion Gate Patron Portal
            </p>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-2.5">
              Sign In to Your Account
            </h1>
            <p className="text-[11px] sm:text-xs text-[#6B6B6B] max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed">
              Connect your Google account to track your orders in real time, manage saved shipping addresses, and enjoy express checkout.
            </p>

            {authError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs flex items-center gap-2.5 text-left">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-3.5 px-8 bg-white hover:bg-[#FAFAF8] text-[#0A0A0A] border border-[#D5D0C9] hover:border-[#0A0A0A] text-xs font-bold tracking-wider uppercase rounded-xs transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60 group active:scale-[0.99]"
              >
                <GoogleIcon className="w-4.5 h-4.5 shrink-0" />
                <span>{authLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Concierge Booking */}
            <div className="mt-5 pt-4 border-t border-[#E8E4DF]/70">
              <p className="text-[11px] text-[#6B6B6B] mb-2.5">
                Don't have a Google account? Place your booking directly with our team.
              </p>
              <a
                href="https://wa.me/94707739962?text=Hello%20Fashion%20Gate%20Concierge%2C%20I%20would%20like%20to%20place%20an%20order%20directly%20via%20WhatsApp."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white text-[11px] font-bold tracking-wider uppercase rounded-xs transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <span>Book / Inquire via WhatsApp</span>
              </a>
            </div>

            {/* VIP Features list */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#E8E4DF] grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
              <div className="flex items-start gap-2.5 p-2 rounded-xs bg-[#FAFAF8] sm:bg-transparent">
                <Truck size={15} className="text-[#C4922A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase text-[#0A0A0A]">Live Tracking</p>
                  <p className="text-[9.5px] sm:text-[10px] text-[#7A7A7A] mt-0.5">Real-time status on all boutique orders.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xs bg-[#FAFAF8] sm:bg-transparent">
                <MapPin size={15} className="text-[#C4922A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase text-[#0A0A0A]">Saved Addresses</p>
                  <p className="text-[9.5px] sm:text-[10px] text-[#7A7A7A] mt-0.5">Auto-fill at checkout in 1 tap.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xs bg-[#FAFAF8] sm:bg-transparent">
                <ShieldCheck size={15} className="text-[#C4922A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10.5px] sm:text-[11px] font-bold uppercase text-[#0A0A0A]">Verified Security</p>
                  <p className="text-[9.5px] sm:text-[10px] text-[#7A7A7A] mt-0.5">Protected with Google OAuth 2.0.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED USER HUB */
          <div className="space-y-6 sm:space-y-8">
            {/* Top User Profile Header Card */}
            <div className="bg-white border border-[#E8E4DF] rounded-sm p-4 sm:p-6 md:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                  <div className="relative shrink-0 group">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={userName}
                        className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#C4922A] shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#0A0A0A] text-[#C4922A] flex items-center justify-center font-display font-bold text-xl sm:text-2xl md:text-3xl border-2 border-[#C4922A] shrink-0">
                        {userInitials}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchParams({ tab: 'profile' });
                        fileInputRef.current?.click();
                      }}
                      className="absolute bottom-0 right-0 p-1 sm:p-1.5 bg-[#0A0A0A] text-[#C4922A] hover:bg-[#C4922A] hover:text-white rounded-full border border-white shadow-xs transition-colors cursor-pointer"
                      title="Upload New Profile Photo"
                    >
                      <Camera size={11} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5">
                      <h1 className="font-display text-base sm:text-xl md:text-2xl font-bold text-[#0A0A0A] truncate leading-snug">
                        {userName}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xs text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider shrink-0">
                        <CheckCircle2 size={10} /> Google Verified
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#7A7A7A] font-mono break-all line-clamp-1 leading-tight">{user?.email}</p>
                    <div className="text-[10px] text-[#9E9E9E] mt-1 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} className="text-[#C4922A]" /> Joined {userJoinedDate}
                      </span>
                      {user?.phoneNumber && (
                        <>
                          <span className="text-[#D5D0C9]">•</span>
                          <span className="text-[#0A0A0A] font-medium font-mono">{user.phoneNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Total Orders + Sign Out Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8E4DF]">
                  <div className="bg-[#FAFAF8] md:bg-transparent px-3 py-1.5 md:p-0 rounded-xs md:rounded-none border md:border-0 border-[#E8E4DF] text-left md:text-right">
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#9E9E9E]">Total Orders</p>
                    <p className="font-mono text-xs sm:text-base md:text-lg font-bold text-[#0A0A0A]">
                      {customerOrders.length} {customerOrders.length === 1 ? 'Order' : 'Orders'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={signOut}
                    className="inline-flex items-center gap-1.5 py-2 px-3 sm:py-2 sm:px-4 bg-[#FAFAF8] hover:bg-red-50 text-[#0A0A0A] hover:text-red-700 border border-[#E8E4DF] hover:border-red-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase rounded-xs transition-colors cursor-pointer shrink-0"
                  >
                    <LogOut size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Luxury Responsive Bar with Micro-Scrollbar) */}
            <div className="flex items-center border-b border-[#E8E4DF] overflow-x-auto tabs-scrollbar-mini gap-1 sm:gap-2 pb-1 sm:pb-0 scroll-smooth">
              <button
                type="button"
                onClick={(e) => {
                  setSearchParams({ tab: 'profile' });
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-t-xs ${activeTab === 'profile'
                    ? 'text-[#0A0A0A] font-extrabold bg-[#FAFAF8] sm:bg-transparent after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#C4922A]'
                    : 'text-[#7A7A7A] hover:text-[#0A0A0A] hover:bg-[#FAFAF8]/60'
                  }`}
              >
                <User size={13} className={activeTab === 'profile' ? 'text-[#C4922A]' : ''} />
                <span><span className="hidden sm:inline">My </span>Profile</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  setSearchParams({ tab: 'orders' });
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-t-xs ${activeTab === 'orders'
                    ? 'text-[#0A0A0A] font-extrabold bg-[#FAFAF8] sm:bg-transparent after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#C4922A]'
                    : 'text-[#7A7A7A] hover:text-[#0A0A0A] hover:bg-[#FAFAF8]/60'
                  }`}
              >
                <ShoppingBag size={13} className={activeTab === 'orders' ? 'text-[#C4922A]' : ''} />
                <span><span className="hidden sm:inline">My </span>Orders ({customerOrders.length})</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  setSearchParams({ tab: 'address' });
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-t-xs ${activeTab === 'address'
                    ? 'text-[#0A0A0A] font-extrabold bg-[#FAFAF8] sm:bg-transparent after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#C4922A]'
                    : 'text-[#7A7A7A] hover:text-[#0A0A0A] hover:bg-[#FAFAF8]/60'
                  }`}
              >
                <MapPin size={13} className={activeTab === 'address' ? 'text-[#C4922A]' : ''} />
                <span><span className="hidden sm:inline">Delivery </span>Address</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  setSearchParams({ tab: 'wishlist' });
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }}
                className={`relative flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-t-xs ${activeTab === 'wishlist'
                    ? 'text-[#0A0A0A] font-extrabold bg-[#FAFAF8] sm:bg-transparent after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#C4922A]'
                    : 'text-[#7A7A7A] hover:text-[#0A0A0A] hover:bg-[#FAFAF8]/60'
                  }`}
              >
                <Heart size={13} className={activeTab === 'wishlist' ? 'text-[#C4922A]' : ''} />
                <span>Wishlist ({wishlistItems.length})</span>
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* TAB 1: MY PROFILE (EDIT DETAILS + PHOTO UPLOAD) */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-[#E8E4DF] rounded-sm p-4 sm:p-6 md:p-8 shadow-xs max-w-3xl space-y-5 sm:space-y-6">
                <div className="pb-3.5 sm:pb-4 border-b border-[#E8E4DF]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5.5 h-5.5 rounded-full bg-[#C4922A]/10 text-[#C4922A] flex items-center justify-center shrink-0">
                      <User size={12} />
                    </div>
                    <h2 className="font-display text-sm sm:text-base md:text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                      Account &amp; Profile Details
                    </h2>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#7A7A7A] leading-relaxed">
                    Upload your profile photo, manage contact info, and personalize your boutique style.
                  </p>
                </div>

                {profileSavedToast && (
                  <div className="p-3 sm:p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xs flex items-center gap-2 font-medium animate-fade-in">
                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    <span>Profile details updated and synchronized successfully!</span>
                  </div>
                )}

                {photoSavedToast && (
                  <div className="p-3 sm:p-3.5 bg-amber-50 border border-amber-300 text-amber-950 text-xs rounded-xs flex items-center gap-2 font-medium shadow-2xs animate-fade-in">
                    <CheckCircle2 size={15} className="text-[#C4922A] shrink-0" />
                    <span>Profile photo updated and saved to your account!</span>
                  </div>
                )}

                {/* HIDDEN FILE PICKERS (GALLERY & CAMERA) */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="user"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* SECTION: LUXURY PROFILE PHOTO STUDIO */}
                <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#FAFAF8] via-[#FAF9F6] to-[#F5F2EC] border border-[#E8E4DF] rounded-xs space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-5">
                    {/* Avatar preview with interactive click-to-upload */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative shrink-0 group cursor-pointer self-start sm:self-auto"
                      title="Click to upload profile photo"
                    >
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile Avatar"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C4922A] shadow-md group-hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0A0A0A] text-[#C4922A] flex items-center justify-center font-display font-bold text-xl sm:text-2xl border-2 border-[#C4922A] shadow-sm">
                          {userInitials}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Camera size={14} />
                        <span className="text-[7px] sm:text-[8px] uppercase tracking-wider font-bold mt-0.5">Change</span>
                      </div>
                      {photoUploading && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
                          <Sparkles size={16} className="animate-spin text-[#C4922A]" />
                        </div>
                      )}
                    </div>

                    {/* Photo details & action buttons */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                          Profile Photo &amp; Avatar
                        </p>
                        <span className="text-[8px] sm:text-[9px] text-[#C4922A] bg-[#C4922A]/10 px-1.5 py-0.5 rounded-2xs font-mono font-bold">
                          Live Sync
                        </span>
                      </div>
                      <p className="text-[10.5px] sm:text-[11px] text-[#7A7A7A] leading-snug">
                        Upload from device, capture with camera, or paste an image URL.
                      </p>

                      {/* Action buttons toolbar (Balanced 2-col on mobile, flex on desktop) */}
                      <div className="pt-1.5 grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={photoUploading}
                          className="py-2 px-3 bg-[#0A0A0A] hover:bg-[#C4922A] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-xs disabled:opacity-60 flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Upload size={11} />
                          <span>{photoUploading ? 'Uploading...' : 'Upload'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenLiveCamera}
                          disabled={photoUploading}
                          className="py-2 px-3 bg-white hover:bg-[#FAFAF8] text-[#0A0A0A] border border-[#D5D0C9] hover:border-[#0A0A0A] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                        >
                          <Camera size={11} className="text-[#C4922A]" />
                          <span>Camera</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUrlInputOpen(!urlInputOpen)}
                          className="py-2 px-3 bg-white hover:bg-[#FAFAF8] text-[#0A0A0A] border border-[#D5D0C9] hover:border-[#0A0A0A] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Link2 size={11} className="text-[#C4922A]" />
                          <span>Paste URL</span>
                        </button>

                        {profilePhoto && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="py-2 px-3 bg-white hover:bg-red-50 text-red-700 border border-red-200 hover:border-red-300 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 sm:ml-auto active:scale-95"
                            title="Remove photo and use initials"
                          >
                            <Trash2 size={11} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Paste Image URL Form */}
                      {urlInputOpen && (
                        <form onSubmit={handleApplyUrlPhoto} className="flex flex-col sm:flex-row gap-2 pt-2 animate-scale-in">
                          <input
                            type="url"
                            value={urlInputValue}
                            onChange={(e) => setUrlInputValue(e.target.value)}
                            placeholder="Paste image URL (https://...)"
                            className="flex-1 bg-white border border-[#E8E4DF] px-3 py-2 text-xs text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              className="flex-1 sm:flex-initial py-2 px-4 bg-[#0A0A0A] hover:bg-[#C4922A] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center"
                            >
                              Apply
                            </button>
                            <button
                              type="button"
                              onClick={() => setUrlInputOpen(false)}
                              className="py-2 px-3 text-xs text-[#7A7A7A] hover:text-[#0A0A0A] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Display Name */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Full Name / Display Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                      />
                    </div>

                    {/* Email (Read Only) */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5 flex items-center justify-between">
                        <span>Google Account Email</span>
                        <span className="text-[8px] sm:text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-2xs font-bold uppercase">
                          ✓ Verified
                        </span>
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full bg-[#EFEFEA]/60 border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#7A7A7A] rounded-xs cursor-not-allowed font-mono"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Primary Phone Number (For Courier SMS &amp; Orders)
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Gender (Optional)
                      </label>
                      <select
                        value={profileGender}
                        onChange={e => setProfileGender(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        value={profileDob}
                        onChange={e => setProfileDob(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
                      />
                    </div>

                    {/* Preferred Size */}
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Preferred Clothing Size
                      </label>
                      <select
                        value={profileSize}
                        onChange={e => setProfileSize(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
                      >
                        <option value="">Select Preferred Size</option>
                        {CLOTHING_SIZES.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Style Notes / Bio */}
                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Style Preferences &amp; Delivery Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={profileBio}
                      onChange={e => setProfileBio(e.target.value)}
                      placeholder="e.g. Loves linen tops and natural shades, prefer morning deliveries..."
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="btn-gold w-full sm:w-auto py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 active:scale-98"
                    >
                      <Save size={14} />
                      <span>{profileSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4 sm:space-y-6">
                {customerOrders.length === 0 ? (
                  <div className="bg-white border border-[#E8E4DF] rounded-sm p-6 sm:p-12 text-center shadow-xs">
                    <ShoppingBag size={36} className="text-[#E8E4DF] mx-auto mb-3" />
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-[#0A0A0A] mb-1.5">No Orders Found</h3>
                    <p className="text-[11px] sm:text-xs text-[#7A7A7A] max-w-sm mx-auto mb-5 sm:mb-6 leading-relaxed">
                      You haven't placed any orders with this Google account yet. Explore our bespoke collections today.
                    </p>
                    <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-block">
                      Explore Collections
                    </Link>
                  </div>
                ) : (
                  customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E8E4DF] rounded-sm p-4 sm:p-6 shadow-xs hover:shadow-sm hover:border-[#C4922A]/40 transition-all space-y-3.5 sm:space-y-4"
                    >
                      {/* Top Order Row: ID, Date, Status & Total Amount */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8E4DF] gap-2.5 sm:gap-4">
                        {/* Left: Order ID & Date */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs sm:text-sm md:text-base font-extrabold text-[#0A0A0A] tracking-tight">
                              {order.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-[#7A7A7A]">
                            <Calendar size={12} className="text-[#C4922A] shrink-0" />
                            <span>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: '2-digit',
                                  year: 'numeric',
                                })
                                : 'Recent'}
                            </span>
                          </div>
                        </div>

                        {/* Right: Status Badge & Total Price */}
                        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1 pt-1 sm:pt-0 border-t border-dashed border-[#E8E4DF] sm:border-0">
                          <span
                            className={`text-[8.5px] sm:text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 border rounded-xs ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {(order.status || 'processing').replace(/_/g, ' ')}
                          </span>
                          <div className="text-right flex sm:block items-baseline gap-1.5">
                            <span className="text-[10px] text-[#7A7A7A] block sm:hidden uppercase font-semibold">Total:</span>
                            <span className="font-bold text-[#0A0A0A] text-xs sm:text-sm md:text-base font-mono whitespace-nowrap">
                              Rs. {(order.total || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Tags: Payment Method & Courier Dispatch Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold text-[#555555] bg-[#FAFAF8] px-2.5 py-1 border border-[#E8E4DF] rounded-xs">
                          <CreditCard size={11} className="text-[#C4922A] shrink-0" />
                          <span>
                            {order.paymentMethod === 'cod'
                              ? 'Cash on Delivery'
                              : order.paymentMethod === 'bank_transfer'
                                ? 'Direct Bank Deposit'
                                : 'Card Payment'}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold text-[#555555] bg-[#FAFAF8] px-2.5 py-1 border border-[#E8E4DF] rounded-xs">
                          <Truck size={11} className="text-[#C4922A] shrink-0" />
                          <span className="truncate">
                            To <strong className="text-[#0A0A0A]">{order.customer?.city || 'Sri Lanka'}</strong> ({order.courierPartner || 'Prompt Express'})
                          </span>
                        </span>
                      </div>

                      {/* Ordered Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                        {(order.items || []).map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center gap-3 bg-[#FAFAF8] p-2.5 sm:p-3 rounded-xs border border-[#E8E4DF] hover:border-[#D5D0C9] transition-colors"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-16 sm:w-14 sm:h-18 object-cover bg-white rounded-xs border border-[#E8E4DF] shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="font-semibold text-xs text-[#0A0A0A] truncate leading-tight">{item.name}</p>
                              <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] text-[#6B6B6B] flex-wrap">
                                <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF] font-medium text-[#0A0A0A]">
                                  Qty: {item.quantity}
                                </span>
                                <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF]">
                                  Size: <strong className="text-[#0A0A0A]">{item.selectedSize}</strong>
                                </span>
                                {item.selectedColor && (
                                  <span className="bg-white px-1.5 py-0.5 rounded-2xs border border-[#E8E4DF]">
                                    {item.selectedColor}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-[#C4922A] font-mono">
                                Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Attached Bank Transfer Receipt Info if present */}
                      {order.bankReceipt && (
                        <div className="p-2.5 sm:p-3 bg-emerald-50/60 border border-emerald-500/30 rounded-xs flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-900 min-w-0">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            <span className="truncate text-[10px] sm:text-[11px] font-semibold">
                              Slip: {order.bankReceiptName || 'Bank_Deposit_Slip.jpg'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSlipModalUrl(order.bankReceipt || null)}
                            className="text-[10px] sm:text-[11px] font-bold text-[#C4922A] hover:underline uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            View Slip
                          </button>
                        </div>
                      )}

                      {/* Bottom Footer Actions */}
                      <div className="pt-2.5 sm:pt-3 border-t border-[#E8E4DF] grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 sm:gap-2.5 text-xs">
                        <Link
                          to={`/order-tracking?id=${order.id}`}
                          className="btn-gold py-2.5 px-3 sm:px-4 text-[10.5px] sm:text-xs font-bold flex items-center justify-center gap-1.5 text-center shadow-2xs"
                        >
                          <Search size={12} /> <span>Live Tracking</span>
                        </Link>
                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="px-3 sm:px-4 py-2.5 border border-[#D5D0C9] hover:border-[#0A0A0A] bg-white hover:bg-[#FAFAF8] text-[10.5px] sm:text-xs font-bold text-[#0A0A0A] rounded-xs transition-colors text-center flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <FileText size={12} className="text-[#7A7A7A]" /> <span>View Receipt</span>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: DELIVERY ADDRESS */}
            {activeTab === 'address' && (
              <div className="bg-white border border-[#E8E4DF] rounded-sm p-4 sm:p-6 md:p-8 shadow-xs max-w-2xl space-y-4 sm:space-y-5">
                <div className="pb-3.5 sm:pb-4 border-b border-[#E8E4DF]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5.5 h-5.5 rounded-full bg-[#C4922A]/10 text-[#C4922A] flex items-center justify-center shrink-0">
                      <MapPin size={12} />
                    </div>
                    <h2 className="font-display text-sm sm:text-base md:text-lg font-bold text-[#0A0A0A] uppercase tracking-wider">
                      Saved Delivery Address
                    </h2>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#7A7A7A] leading-relaxed">
                    This address will be automatically populated when you proceed to checkout.
                  </p>
                </div>

                {addressSavedToast && (
                  <div className="p-3 sm:p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xs flex items-center gap-2 font-medium animate-fade-in">
                    <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                    <span>Default delivery address saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveAddress} className="space-y-3.5 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addrFullName}
                        onChange={e => setAddrFullName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={addrPhone}
                        onChange={e => setAddrPhone(e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={addrStreet}
                      onChange={e => setAddrStreet(e.target.value)}
                      placeholder="e.g. No. 45/A, Thalawathugoda Road"
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={e => setAddrCity(e.target.value)}
                        placeholder="e.g. Colombo, Kotte, Kandy"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={addrPostalCode}
                        onChange={e => setAddrPostalCode(e.target.value)}
                        placeholder="e.g. 10100"
                        className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] sm:text-[11px] tracking-[0.08em] uppercase text-[#0A0A0A] font-bold mb-1.5">
                      Province / Region
                    </label>
                    <select
                      value={addrProvince}
                      onChange={e => setAddrProvince(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#E8E4DF] px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#0A0A0A] outline-none focus:border-[#C4922A] rounded-xs cursor-pointer"
                    >
                      {SRI_LANKA_PROVINCES.map(p => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="btn-gold w-full sm:w-auto py-3 px-8 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 active:scale-98"
                    >
                      <CheckCircle2 size={14} />
                      <span>{savingAddress ? 'Saving Address...' : 'Save Default Address'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistItems.length === 0 ? (
                  <div className="bg-white border border-[#E8E4DF] rounded-sm p-8 sm:p-12 text-center shadow-xs">
                    <Heart size={40} className="text-[#E8E4DF] mx-auto mb-3" />
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-[#0A0A0A] mb-1.5">Your Wishlist is Empty</h3>
                    <p className="text-[11px] sm:text-xs text-[#7A7A7A] max-w-sm mx-auto mb-5 sm:mb-6 leading-relaxed">
                      Browse our boutique catalog and tap the heart icon on any piece you adore.
                    </p>
                    <Link to="/shop" className="btn-gold text-xs py-2.5 px-6 inline-block">
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {wishlistItems.map(product => (
                      <div
                        key={product.id}
                        className="bg-white border border-[#E8E4DF] rounded-sm overflow-hidden flex flex-col group shadow-xs hover:border-[#C4922A] transition-all"
                      >
                        <div className="relative aspect-[3/4] bg-[#F2F0ED] overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                          <p className="text-[8.5px] sm:text-[9px] text-[#9E9E9E] uppercase tracking-wider font-semibold">
                            {product.category}
                          </p>
                          <h4 className="font-display font-bold text-[11px] sm:text-xs text-[#0A0A0A] line-clamp-1 mt-0.5">
                            {product.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs font-bold text-[#C4922A] mt-1 font-mono">
                            Rs. {product.price.toLocaleString()}
                          </p>

                          <div className="mt-auto pt-2.5 sm:pt-3 flex gap-1.5 sm:gap-2">
                            <Link
                              to={`/product/${product.id}`}
                              className="flex-1 py-1.5 bg-[#0A0A0A] hover:bg-[#C4922A] text-white text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-center rounded-xs transition-colors"
                            >
                              View
                            </Link>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product)}
                              className="p-1.5 border border-[#E8E4DF] hover:border-red-300 text-[#7A7A7A] hover:text-red-600 rounded-xs transition-colors cursor-pointer"
                              title="Remove from wishlist"
                            >
                              <Heart size={13} className="fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIVE DEVICE CAMERA MODAL */}
      {cameraModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={handleCloseCameraModal}
        >
          <div
            className="bg-[#141414] text-white rounded-sm max-w-sm w-full overflow-hidden shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/10 bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Camera size={15} className="text-[#C4922A]" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  Live Device Camera
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseCameraModal}
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Close Camera"
              >
                <X size={18} />
              </button>
            </div>

            {/* Camera Viewport / Snapshot Preview */}
            <div className="p-4 sm:p-5 flex flex-col items-center">
              {cameraError ? (
                <div className="w-full aspect-square max-w-[280px] sm:max-w-[320px] bg-neutral-900 border border-neutral-800 rounded-sm flex flex-col items-center justify-center p-5 text-center text-xs space-y-3.5">
                  <AlertCircle size={30} className="text-amber-500" />
                  <div>
                    <p className="font-bold text-white mb-1">Camera Permission Needed</p>
                    <p className="text-neutral-400 text-[10.5px] leading-relaxed">
                      Please allow camera access in your browser or tap below to open the device camera app.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCameraModal();
                      cameraInputRef.current?.click();
                    }}
                    className="py-2 px-4 bg-[#C4922A] hover:bg-[#D4A33E] text-black text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shadow-md"
                  >
                    Open Device Camera App
                  </button>
                </div>
              ) : capturedPhoto ? (
                /* SNAPSHOT PREVIEW */
                <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] rounded-sm overflow-hidden border-2 border-[#C4922A] shadow-lg bg-black">
                  <img src={capturedPhoto} alt="Captured snapshot" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-emerald-400 text-[8.5px] font-mono font-bold rounded-2xs border border-emerald-500/30">
                    ✓ Snapshot Captured
                  </div>
                </div>
              ) : (
                /* LIVE VIEWFINDER */
                <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] rounded-sm overflow-hidden border border-white/20 shadow-lg bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${cameraFacing === 'user' ? '-scale-x-100' : ''}`}
                  />
                  {/* Viewfinder Golden Brackets */}
                  <div className="absolute top-2.5 left-2.5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#C4922A] pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#C4922A] pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#C4922A] pointer-events-none" />
                  <div className="absolute bottom-2.5 right-2.5 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#C4922A] pointer-events-none" />

                  {/* Live Indicator Badge */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-mono uppercase tracking-widest rounded-full border border-white/10 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>CAMERA ACTIVE</span>
                  </div>
                </div>
              )}

              {/* CONTROLS */}
              {!cameraError && (
                <div className="w-full mt-4 sm:mt-5">
                  {capturedPhoto ? (
                    <div className="flex items-center gap-2.5 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedPhoto(null);
                          startCameraStream(cameraFacing);
                        }}
                        className="flex-1 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw size={13} />
                        <span>Retake</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmCapturedPhoto}
                        className="flex-1 py-2.5 px-3 bg-[#C4922A] hover:bg-[#D4A33E] text-black text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check size={14} />
                        <span>Use Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 sm:px-4">
                      {/* Flip Camera Button */}
                      <button
                        type="button"
                        onClick={handleFlipCamera}
                        className="w-11 h-11 bg-neutral-800/90 hover:bg-neutral-700 text-white rounded-full border border-white/10 transition-colors cursor-pointer flex items-center justify-center active:scale-90"
                        title="Flip Front / Rear Camera"
                      >
                        <RefreshCw size={16} />
                      </button>

                      {/* Shutter Button */}
                      <button
                        type="button"
                        onClick={handleCaptureSnapshot}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C4922A] hover:bg-[#D4A33E] p-1 border-4 border-white/30 shadow-[0_0_20px_rgba(196,146,42,0.4)] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        title="Take Photo"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-black bg-white flex items-center justify-center">
                          <Camera size={16} className="text-black sm:w-4.5 sm:h-4.5" />
                        </div>
                      </button>

                      {/* Native App Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseCameraModal();
                          cameraInputRef.current?.click();
                        }}
                        className="w-11 h-11 bg-neutral-800/90 hover:bg-neutral-700 text-white rounded-full border border-white/10 transition-colors cursor-pointer flex items-center justify-center active:scale-90"
                        title="Open Native Camera App"
                      >
                        <Upload size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slip Modal Lightbox */}
      {slipModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setSlipModalUrl(null)}
        >
          <div
            className="bg-white rounded-sm max-w-lg w-full overflow-hidden shadow-2xl p-4 border border-[#E8E4DF]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DF]">
              <p className="font-bold text-xs uppercase tracking-wider text-[#0A0A0A]">
                Bank Deposit / Transfer Receipt
              </p>
              <button
                type="button"
                onClick={() => setSlipModalUrl(null)}
                className="text-xs font-bold text-[#7A7A7A] hover:text-[#0A0A0A] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="py-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-[#FAFAF8] rounded-xs">
              <img src={slipModalUrl} alt="Deposit Slip" className="max-h-[65vh] w-auto object-contain rounded-xs" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
