-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Prescriptions Table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT,
    instructions TEXT,
    doctor_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders Table
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'missed')),
    taken_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Adherence Log Table
CREATE TABLE adherence_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    taken_count INTEGER DEFAULT 0,
    missed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Conversations Table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    emotion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    audio_url TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_scheduled_time ON reminders(scheduled_time);
CREATE INDEX idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_adherence_log_user_date ON adherence_log(user_id, date);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" 
    ON users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
    ON users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" 
    ON users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- RLS Policies for prescriptions table
CREATE POLICY "Users can view own prescriptions" 
    ON prescriptions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prescriptions" 
    ON prescriptions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prescriptions" 
    ON prescriptions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prescriptions" 
    ON prescriptions FOR DELETE 
    USING (auth.uid() = user_id);

-- RLS Policies for reminders table
CREATE POLICY "Users can view own reminders" 
    ON reminders FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" 
    ON reminders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" 
    ON reminders FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" 
    ON reminders FOR DELETE 
    USING (auth.uid() = user_id);

-- RLS Policies for adherence_log table
CREATE POLICY "Users can view own adherence" 
    ON adherence_log FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adherence" 
    ON adherence_log FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own adherence" 
    ON adherence_log FOR UPDATE 
    USING (auth.uid() = user_id);

-- RLS Policies for conversations table
CREATE POLICY "Users can view own conversations" 
    ON conversations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" 
    ON conversations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications" 
    ON notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
    ON notifications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for prescription images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true);

-- Storage policies
CREATE POLICY "Users can upload own prescriptions"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own prescriptions"
ON storage.objects FOR SELECT
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view prescriptions"
ON storage.objects FOR SELECT
USING (bucket_id = 'prescriptions');
