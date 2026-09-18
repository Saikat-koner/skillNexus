-- ============================================================================
-- 🚀 SKILLNEXUS: CREATOR MARKETPLACE & GIG BOOKING PLATFORM
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA MIGRATION
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search on gigs and skills

-- ============================================================================
-- 1. PROFILES TABLE (EXTENDS AUTH.USERS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    headline TEXT,
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'creator', 'both', 'admin')),
    skills TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"English"}',
    hourly_rate NUMERIC(10,2) DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_orders_completed INTEGER DEFAULT 0,
    total_earnings NUMERIC(12,2) DEFAULT 0,
    creator_tier TEXT DEFAULT 'New Creator' CHECK (creator_tier IN ('New Creator', 'Rising Star', 'Level 1 Pro', 'Level 2 Elite', 'Top Rated Legend')),
    is_verified BOOLEAN DEFAULT FALSE,
    response_time_hours INTEGER DEFAULT 2,
    location_country TEXT DEFAULT 'Global',
    social_links JSONB DEFAULT '{"github": "", "twitter": "", "portfolio": "", "linkedin": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================================
-- 2. GIG CATEGORIES & SUBCATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS gig_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0
);

INSERT INTO gig_categories (slug, name, icon, description, is_popular, display_order) VALUES
('ai-development', 'AI & Machine Learning', '🤖', 'LLM agents, prompt engineering, custom AI models, and automation bots', TRUE, 1),
('web-mobile-dev', 'Web & Mobile Apps', '💻', 'Full-stack web apps, Flutter, React, Next.js, and mobile solutions', TRUE, 2),
('ui-ux-design', 'UI/UX & Product Design', '🎨', 'Figma prototypes, design systems, modern web and mobile UI', TRUE, 3),
('video-animation', 'Video Editing & 3D', '🎬', 'Shorts/Reels, YouTube editing, 3D motion graphics, and VFX', TRUE, 4),
('blockchain-web3', 'Web3 & Smart Contracts', '⚡', 'Solidity, smart contract audits, dApps, and tokenomics', FALSE, 5),
('voice-music', 'Voiceover & Music Production', '🎙️', 'Studio voiceovers, podcast mastering, custom beats, and sound FX', FALSE, 6),
('growth-marketing', 'Growth & Digital Marketing', '📈', 'SEO optimization, viral social media management, and paid ads', FALSE, 7),
('writing-translation', 'Content Writing & Copy', '✍️', 'Technical articles, copywriting, landing page sales copy, and scripts', FALSE, 8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. GIGS (SERVICE OFFERINGS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_slug TEXT NOT NULL REFERENCES gig_categories(slug),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    video_preview_url TEXT,

    -- Tier Pricing Architecture (Starter, Standard, Pro)
    starter_price NUMERIC(10,2) NOT NULL CHECK (starter_price > 0),
    starter_title TEXT NOT NULL DEFAULT 'Basic Tier',
    starter_desc TEXT NOT NULL DEFAULT 'Core essential deliverables',
    starter_delivery_days INTEGER NOT NULL DEFAULT 3,
    starter_revisions INTEGER NOT NULL DEFAULT 1,
    starter_features TEXT[] DEFAULT '{}',

    standard_price NUMERIC(10,2) CHECK (standard_price >= starter_price),
    standard_title TEXT DEFAULT 'Standard Tier',
    standard_desc TEXT DEFAULT 'Complete standard project package',
    standard_delivery_days INTEGER DEFAULT 5,
    standard_revisions INTEGER DEFAULT 3,
    standard_features TEXT[] DEFAULT '{}',

    pro_price NUMERIC(10,2) CHECK (pro_price >= standard_price),
    pro_title TEXT DEFAULT 'Pro / Enterprise Tier',
    pro_desc TEXT DEFAULT 'Full-featured premium package with priority support',
    pro_delivery_days INTEGER DEFAULT 7,
    pro_revisions INTEGER DEFAULT 99, -- Unlimited
    pro_features TEXT[] DEFAULT '{}',

    rating NUMERIC(3,2) DEFAULT 5.00,
    total_reviews INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gigs_creator ON gigs(creator_id);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category_slug);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_rating ON gigs(rating DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_tags ON gigs USING GIN(tags);

-- Trigram index for ultra-fast title & description search
CREATE INDEX IF NOT EXISTS idx_gigs_title_trgm ON gigs USING GIN(title gin_trgm_ops);

-- ============================================================================
-- 4. ORDERS & ESCROW TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,

    tier_selected TEXT NOT NULL CHECK (tier_selected IN ('starter', 'standard', 'pro', 'custom')),
    package_title TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    seller_payout NUMERIC(10,2) NOT NULL,

    status TEXT NOT NULL DEFAULT 'pending_requirements' CHECK (
        status IN ('pending_requirements', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed')
    ),

    client_requirements TEXT,
    requirements_submitted_at TIMESTAMPTZ,

    delivery_note TEXT,
    delivery_files TEXT[] DEFAULT '{}',
    delivered_at TIMESTAMPTZ,

    due_date TIMESTAMPTZ NOT NULL,
    revisions_remaining INTEGER DEFAULT 2,
    cancellation_reason TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_gig ON orders(gig_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_due_date ON orders(due_date);

-- ============================================================================
-- 5. 1-ON-1 MENTORSHIP & CONSULTATION BOOKINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    topic TEXT NOT NULL,
    details TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45 CHECK (duration_minutes IN (15, 30, 45, 60, 90)),
    price NUMERIC(10,2) NOT NULL DEFAULT 0,

    meeting_platform TEXT DEFAULT 'google_meet' CHECK (meeting_platform IN ('google_meet', 'zoom', 'in_app_webrtc')),
    meeting_link TEXT,

    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_session', 'completed', 'cancelled', 'rescheduled')),
    client_notes TEXT,
    creator_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_creator ON consultations(creator_id);
CREATE INDEX IF NOT EXISTS idx_consultations_client ON consultations(client_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled ON consultations(scheduled_at);

-- ============================================================================
-- 6. DIRECT MESSAGING & REALTIME CHAT
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_a UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    participant_b UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_conversation_pair UNIQUE (participant_a, participant_b)
);

CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

    text TEXT NOT NULL,
    attachment_urls TEXT[] DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_convo ON direct_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created ON direct_messages(created_at DESC);

-- ============================================================================
-- 7. REVIEWS & RATINGS (VERIFIED PURCHASE ONLY)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    service_quality_rating INTEGER CHECK (service_quality_rating >= 1 AND service_quality_rating <= 5),
    delivery_speed_rating INTEGER CHECK (delivery_speed_rating >= 1 AND delivery_speed_rating <= 5),

    review_text TEXT NOT NULL,
    showcase_media_url TEXT,
    creator_reply_text TEXT,
    creator_replied_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_gig ON reviews(gig_id);
CREATE INDEX IF NOT EXISTS idx_reviews_creator ON reviews(creator_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);

-- ============================================================================
-- 8. CREATOR PAYOUTS & WALLET
-- ============================================================================

CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 20.00), -- Minimum $20
    payout_method TEXT NOT NULL CHECK (payout_method IN ('stripe_connect', 'paypal', 'bank_wire', 'crypto_usdc')),
    account_details JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
    rejection_reason TEXT,
    transaction_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_creator ON payout_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);

-- ============================================================================
-- 9. USER BOOKMARKS & WISHLISTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS gig_bookmarks (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, gig_id)
);

-- ============================================================================
-- 10. AUTOMATED DATABASE TRIGGERS & BUSINESS LOGIC
-- ============================================================================

-- Function: Automatically create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url,
        role
    ) VALUES (
        NEW.id,
        LOWER(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Recalculate Gig & Creator Rating when a review is submitted
CREATE OR REPLACE FUNCTION public.recalculate_ratings_after_review()
RETURNS TRIGGER AS $$
DECLARE
    v_avg_rating NUMERIC(3,2);
    v_count INTEGER;
BEGIN
    -- Update Gig Rating & Count
    SELECT COALESCE(AVG(rating), 5.00), COUNT(*)
    INTO v_avg_rating, v_count
    FROM public.reviews
    WHERE gig_id = NEW.gig_id;

    UPDATE public.gigs
    SET rating = v_avg_rating,
        total_reviews = v_count
    WHERE id = NEW.gig_id;

    -- Update Creator Overall Rating & Count
    SELECT COALESCE(AVG(rating), 5.00), COUNT(*)
    INTO v_avg_rating, v_count
    FROM public.reviews
    WHERE creator_id = NEW.creator_id;

    UPDATE public.profiles
    SET rating = v_avg_rating,
        total_reviews = v_count,
        -- Auto-promote tier based on volume and rating
        creator_tier = CASE
            WHEN v_count >= 50 AND v_avg_rating >= 4.90 THEN 'Top Rated Legend'
            WHEN v_count >= 20 AND v_avg_rating >= 4.80 THEN 'Level 2 Elite'
            WHEN v_count >= 5 AND v_avg_rating >= 4.50 THEN 'Level 1 Pro'
            WHEN v_count >= 1 THEN 'Rising Star'
            ELSE 'New Creator'
        END
    WHERE id = NEW.creator_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_submitted ON public.reviews;
CREATE TRIGGER on_review_submitted
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_ratings_after_review();

-- Function: Update Creator Earnings & Order Counts upon Order Completion
CREATE OR REPLACE FUNCTION public.handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Add earnings to creator profile
        UPDATE public.profiles
        SET total_earnings = total_earnings + NEW.seller_payout,
            total_orders_completed = total_orders_completed + 1
        WHERE id = NEW.seller_id;

        -- Increment gig order count
        UPDATE public.gigs
        SET total_orders = total_orders + 1
        WHERE id = NEW.gig_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_completed ON public.orders;
CREATE TRIGGER on_order_completed
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_order_completion();

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Gigs
CREATE POLICY "Categories are readable by everyone" ON gig_categories FOR SELECT USING (true);
CREATE POLICY "Active gigs are readable by everyone" ON gigs FOR SELECT USING (status = 'active' OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert own gigs" ON gigs FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own gigs" ON gigs FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete own gigs" ON gigs FOR DELETE USING (auth.uid() = creator_id);

-- Orders
CREATE POLICY "Users can view orders they are involved in" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update order states" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Consultations
CREATE POLICY "Users can view own consultations" ON consultations FOR SELECT USING (auth.uid() = client_id OR auth.uid() = creator_id);
CREATE POLICY "Clients can book consultations" ON consultations FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Participants can update consultations" ON consultations FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = creator_id);

-- Conversations & Messages
CREATE POLICY "Users view own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_a OR auth.uid() = participant_b);
CREATE POLICY "Users view messages in their conversations" ON direct_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can mark messages as read" ON direct_messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Reviews
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can write reviews for completed orders" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Creators can reply to reviews" ON reviews FOR UPDATE USING (auth.uid() = creator_id);

-- Bookmarks
CREATE POLICY "Users can view own bookmarks" ON gig_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add bookmarks" ON gig_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete bookmarks" ON gig_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Payouts
CREATE POLICY "Creators view own payouts" ON payout_requests FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can request payouts" ON payout_requests FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- ============================================================================
-- 12. STORAGE BUCKETS CONFIGURATION
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
('gig-covers', 'gig-covers', true),
('portfolio-media', 'portfolio-media', true),
('avatars', 'avatars', true),
('order-deliverables', 'order-deliverables', false)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Access
CREATE POLICY "Public Access for Gig Covers" ON storage.objects FOR SELECT USING (bucket_id IN ('gig-covers', 'portfolio-media', 'avatars'));
CREATE POLICY "Authenticated users can upload gig media" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('gig-covers', 'portfolio-media', 'avatars') AND auth.role() = 'authenticated');
CREATE POLICY "Users can access their order deliverables" ON storage.objects FOR SELECT USING (bucket_id = 'order-deliverables' AND auth.role() = 'authenticated');
