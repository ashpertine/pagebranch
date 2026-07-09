--
-- PostgreSQL database dump
--

\restrict V44nKU4Dl5Ecg2OhCCcwEsuz8xQdEHMBsKmQYkrzlAglEiHXzGMkSYHIlJqqB2N

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_user_fk;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_user_fk;
ALTER TABLE IF EXISTS ONLY public.ratings DROP CONSTRAINT IF EXISTS ratings_user_fk;
ALTER TABLE IF EXISTS ONLY public.ratings DROP CONSTRAINT IF EXISTS ratings_story_fk;
ALTER TABLE IF EXISTS ONLY public.passages DROP CONSTRAINT IF EXISTS passages_story_fk;
ALTER TABLE IF EXISTS ONLY public.choices DROP CONSTRAINT IF EXISTS choice_to_passage_fk;
ALTER TABLE IF EXISTS ONLY public.choices DROP CONSTRAINT IF EXISTS choice_from_passage_fk;
DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_share_slug_key;
ALTER TABLE IF EXISTS ONLY public.stories DROP CONSTRAINT IF EXISTS stories_pkey;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.ratings DROP CONSTRAINT IF EXISTS ratings_user_unique;
ALTER TABLE IF EXISTS ONLY public.ratings DROP CONSTRAINT IF EXISTS ratings_pkey;
ALTER TABLE IF EXISTS ONLY public.passages DROP CONSTRAINT IF EXISTS passages_pkey;
ALTER TABLE IF EXISTS ONLY public.choices DROP CONSTRAINT IF EXISTS choices_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.stories;
DROP TABLE IF EXISTS public.settings;
DROP TABLE IF EXISTS public.session;
DROP TABLE IF EXISTS public.ratings;
DROP TABLE IF EXISTS public.passages;
DROP TABLE IF EXISTS public.choices;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: choices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.choices (
    id integer NOT NULL,
    label character varying(255) NOT NULL,
    from_passage_id integer,
    to_passage_id integer,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: choices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.choices ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.choices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: passages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passages (
    id integer NOT NULL,
    story_id integer NOT NULL,
    title text,
    description text,
    pos_x integer DEFAULT 120 NOT NULL,
    pos_y integer DEFAULT 120 NOT NULL
);


--
-- Name: passages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.passages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.passages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    story_id integer NOT NULL,
    from_user_id integer NOT NULL,
    rating integer NOT NULL,
    description character varying(1000),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ratings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ratings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    preferences jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.settings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stories (
    id integer NOT NULL,
    author_id integer NOT NULL,
    story_title character varying(255) NOT NULL,
    start_passage_id integer,
    is_pinned boolean DEFAULT false NOT NULL,
    is_private boolean DEFAULT true NOT NULL,
    share_slug character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: stories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.stories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.stories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: choices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.choices (id, label, from_passage_id, to_passage_id, sort_order) FROM stdin;
1	Wake up the captain	2	3	0
2	Investigate quietly first	2	4	1
3	Take the shuttle out yourself now, no backup	4	1	0
4	Wake the captain after all	4	5	1
7	Gun it, signal's getting weaker	3	1	0
8	Fly in cautious and slow	3	5	1
9	Board the Halcyon immediately	5	9	0
10	Hold position and try to hail the unkown contract	5	10	1
12	Try to bluff your way through	1	11	0
13	Own up to the truth and ask what's going on	1	10	1
14	The Ember-Wyrm sleeping in the old iron mine	13	12	0
15	The Witch of the Frostwood	13	14	1
16	The shrine atop Skyreach Peak	13	15	2
17	Kneel and ask the flame for help	15	16	0
19	Ask her plainly to help out of kindness	14	16	0
20	Try to simply take a coal while it's talking	12	17	0
22	Offer a precious item (your grandmother's ring)	12	16	1
21	Offer a trade of your own - a skill or a service	14	17	1
18	Just take the fire and start back down 	15	17	1
23	Spend some time teaching her the basics	18	19	0
24	Point her toward the beginner rail	18	20	1
25	Show her what you just learned	20	21	0
26	Keep practicing solo	20	22	1
28	Go chase your own trick	19	22	1
27	Show her the trick	19	21	0
\.


--
-- Data for Name: passages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.passages (id, story_id, title, description, pos_x, pos_y) FROM stdin;
16	2	The Kindled Village	Whatever your path — the ring given freely, the honest request made, the plain ask for kindness — you come away with a small flame cupped in a lantern, and something else too: the sense that you were given this, not merely allowed to take it.\nThe walk back to Wrenmoor feels different. Lighter. When you touch the new flame to the Hearthstone's dying candle-glow, it doesn't just relight — it roars up gold and warm, bigger and steadier than anyone remembers it burning before. The elders say the Hearthstone remembers kindness. **Maybe it does**.\n\nYears later, you're the one who tells this story to apprentices of your own, and the fire in the square still burns exactly as bright as the day you brought it home.	-34	771
17	2	A Fire Half-Owned	Whatever your path — a bargain struck, a trade made, or fire simply taken while no one was looking — you get your flame. But nothing about this transaction was clean, and fire remembers how it changes hands.\n\nThe Hearthstone relights, bright and strong, and Wrenmoor is saved from the frost-wolves and the dark. But something lingers. If you struck a bargain, the debt comes calling sooner or later — a Witch or a Wyrm remembering exactly what you owe. If you simply took the fire, it burns a little wrong ever after: too hungry, too wild, casting shadows that move a half-second late.\n\nEither way, **you saved the village.** You're just never quite sure, on quiet nights, what it cost you to do it.	716	598
21	3	The Long Way Round	You skip the kickflip — for today, anyway — and spend the rest of the morning next to the beginner rail instead. By noon, the kid can push, turn, and stop without looking like she's negotiating with gravity. It's not glamorous. There's no trick to show for it, no clip to post.\n\nBut when she finally rolls the full length of the rail without stopping, she throws both arms up like she just won something enormous. And honestly? Watching that might be better than landing the kickflip would've felt.\n\nYou walk home without your trick, but you're already thinking about tomorrow — and so, you suspect, is she.	-45	612
15	2	The Long Climb	Skyreach Peak takes you a full day and night to climb, and by the time you reach the shrine at its summit, your hands are numb and your legs are shaking. Inside a ring of ancient standing stones, a small flame burns without any wood to feed it — the First Flame, older than Wrenmoor itself.\n\nThere's no guardian here. No creature to bargain with. Just the fire, and a single carved warning at the shrine's entrance: "Fire freely given returns freely. Fire taken, takes back."	823	243
12	2	Into the Dark	The old mine is black as pitch and smells of hot iron. Deep in, coiled around a vein of molten ore, sleeps the Ember-Wyrm — a creature made of living coal and old grudges, according to the miners who sealed this tunnel two generations ago.\n\nIt stirs before you're anywhere near it. One eye, glowing like a dying coal, opens and fixes on you.\n"Small thing," it rumbles, voice like shifting gravel. "You want fire. Everyone always wants fire. What will you give for it?"	-334	211
5	1	Slow and Steady	Whether by your own good sense or the captain's orders, you approach carefully. Full scans, minimum thrust, running silent. It costs you twenty extra minutes, but twenty minutes turns out to matter.\n\nThe scans reveal the truth: what looked like debris is actually a cloaked research vessel, the Halcyon, still mostly intact, tumbling slowly with one dead engine. And the scan also reveals something else — a second contact, small and fast, closing in from the far side of the field. Not yours. Not answering hails.\n\nYou have time to react because you were paying attention.	-79	347
18	3	First Light at the Park	The skatepark is nearly empty when you get there — just you, your board, and the low morning sun turning the concrete gold. You've been trying to land a kickflip off the big ramp for three weeks straight, and today feels different. Looser wrists, better balance, that itch in your legs that says today's the day.\n\nAs you're strapping your pads on, a kid — maybe nine, ten years old — walks up holding a board that's clearly brand new, stickers still half-peeled off the bottom.\n\n"Can you teach me something?" she asks. "Anybody. I don't care what."	189	169
13	2	The Dying Hearth	The village of Wrenmoor has one fire left — *the Hearthstone,* a magical flame that's burned in the village square for three hundred years, keeping the frost-wolves and worse things at bay. Tonight, for the first time anyone can remember, it's guttering. Dying.\n\n**You're the blacksmith's apprentice,** and you're the one who noticed. The elders are arguing about what to do while the flame shrinks to the size of a candle. An old story says the Hearthstone can be relit — but only with fire stolen or gifted from one of three sources, each guarded by something that won't give it up easily.	265	7
22	3	Both Things Can Be True	You land the kickflip — or you send the kid off with enough basics to build on — and then you go chase the rest of your own morning. By early afternoon, you've landed the trick clean, twice, just to prove the first one wasn't luck.\n\nPacking up your board, you spot the kid again, further down the park now, standing tall on her board and pushing in a long, wobbly, triumphant line across the concrete. She sees you watching and gives you a nod, like she's saying I've got it from here.\n\nYou didn't have to choose between your own progress and hers — you just had to trust that both could happen, at the same time, in the same two hours, without either one needing your full attention.	503	716
20	3	Solo Focus	"Beginner rail's over there," you say, nodding toward the low rail near the entrance. "Start with just standing on the board without moving — sounds boring, but it's everything." She nods, a little deflated, and wanders off.\n\nYou've got the ramp mostly to yourself now. You run it a dozen times, feeling out the takeoff, the flick, the landing — close, close, so close. On attempt thirteen, you land it clean. Both feet, wheels down, no wobble. Three weeks of bruised knees, and there it is.\n\nYou whoop, maybe a little too loud for 8 a.m., and catch the kid watching from the rail, still working on just standing still. She gives you a thumbs up like she means it.	507	382
19	3	Paying it Foward	You crouch down to her level. "Okay — first thing, forget the board for a second. Show me how you stand when you're just walking."\n\nShe plants her feet, self-conscious. You adjust her stance, show her how to distribute her weight, how to fall without turning it into a disaster. It's slow going. She wobbles, catches herself, wobbles again, and grins every single time like falling is half the fun.\n\nTwenty minutes in, she manages three full pushes without stepping off. Her face does something complicated — pride fighting with disbelief.\n\n"I did it. Did you see that? I did that."\n"You did that," you agree.	-50	376
14	2	The Witch's Bargain	The Frostwood is silent and blue-shadowed, and the Witch's cottage sits crooked between two frozen trees, smoke curling from a chimney that shouldn't work in this cold. She opens the door before you knock, unsurprised.\n\n"The Hearthstone's dying," she says. Not a question. "Everyone comes to me eventually. I'll give you fire — for a price, of course. I never give anything away for free. That would be bad business. Unless, of course, you're the type she'd give it to for nothing."	264	248
9	1	The Rescue	You dock with the Halcyon and cut your way in. Inside, you find one survivor — Dr. Imogen Vass, a xenolinguist who's been alone on a dying ship for eleven days, rationing air and hope in roughly equal measure. She nearly cries when she sees you're human.\n\nThe unknown contact turns out to be an automated salvage drone, long since abandoned by whoever sent it, and it peels off harmlessly once it registers the Halcyon as claimed.\nYou get Vass back to the Marigold with minutes of air to spare. Captain Oyelaran is furious you took the risk — and even more furious that it paid off, because now she has to admit you were right.\n\nVass, once recovered, tells you the Halcyon was researching something in this debris field worth dying for. She doesn't get more specific. Not yet, anyway.	-550	726
1	1	Fortune Favors the Bold	## You floor it. \n\nThe shuttle rattles through the debris field, dodging chunks of old hull plating and frozen coolant clouds, and you reach the source of the signal in record time — but "record time" means you didn't scan first.\nYou're inside visual range before you realize the "wreck" is a cloaked ship, and it's not alone. A second vessel decloaks right beside you, weapons already hot, clearly having been waiting for exactly this kind of reckless approach.\nA voice crackles over open comms, amused rather than angry: \n\n*"Well. That was fast. Faster than smart, but fast."*	-70	721
3	1	Chain of Command	You do the responsible thing and rouse Captain Oyelaran from cryo. She emerges grumpy, disoriented, and unimpressed.\n\n"You woke me up for a signal?"\n\nBut when she sees the data — a repeating pattern, structured, clearly not natural — her annoyance evaporates. \n\n"That's not debris chatter. That's a distress beacon. Old-world encryption too, pre-Collapse." \n\nShe authorizes a short-range shuttle to investigate, with you as pilot since you're already awake and, in her words, "already made this mess."	-431	165
2	1	The Drift	The salvage ship *Marigold* creaks around you as it drifts through the debris field of what used to be Kepler Station. You're the only crew member awake — cryo-sleep glitched, and now you're stuck babysitting a ship full of sleeping miners for six more months.\n\nThen the console pings. A signal. Old, garbled, but definitely artificial. And it's coming from inside the debris field, not from any known wreck.	-67	27
11	1	The Long Con	You keep your voice level and lie smooth: "Salvage crew, just here for scrap. Didn't mean to trip any wires."\nThere's a pause just long enough to make you sweat. Then the voice laughs — actually laughs. "Nice try. Nobody 'accidentally' beelines for a cloaked ship at full burn. But I like the nerve. Here's the deal: help us finish what the Halcyon started, and we forget you were ever here."\n\nTurns out the strangers are a fringe research collective, not pirates, and the Halcyon was one of their ships — its "distress signal" was actually bait, a test to see who'd come running and how they'd react under pressure. You passed, in the least respectable way possible.\n\nYou end up brokering a deal on the spot: safe passage and a modest payout for the Marigold, in exchange for your silence about the collective's presence in the debris field. Captain Oyelaran will never know how close this came to becoming an international incident — or that you talked your way out of it with a lie that barely held together.	-290	983
4	1	Curiosity Killed the Cat	You decide to poke around before waking anyone — no sense causing a fuss over nothing. You isolate the signal, boost the gain, and pipe it through the cabin speakers.\n\nIt's not static. It's a voice. Distorted, looping, but a voice, saying the same six words over and over: \n\n*"...anyone still out there, please..."*\n\n**Your hands are shaking a little**. This changes things. A person — or something that sounds like one — has been floating out here, alone, for who knows how long.	354	178
10	1	First Contract	You hold your ground and hail the newcomer, hands hovering over controls but not touching weapons. Static, then a reply — halting, translated through a synthesizer with an accent that isn't quite human.\n\nIt's not a person. It's a scout probe from a species you've never heard of, drawn to the same distress beacon you were. It explains, in careful fragments, that the Halcyon had been surveying an anomaly — something in the debris field that "sings," in the probe's words, a phrase that doesn't quite translate.\n\nThe probe isn't hostile. It's curious, cautious, and — you slowly realize — as surprised to find you as you are to find it.\nYou spend the next several hours in the strangest conversation of your life, relaying questions back to the Marigold while Captain Oyelaran alternates between panicking and taking frantic notes. By the end of it, nothing has been resolved about the Halcyon's survivor, if there even is one — but humanity just had its first real conversation with someone else.	261	972
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (id, story_id, from_user_id, rating, description, created_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (sid, sess, expire) FROM stdin;
bnvQTRlJfhLxZ8pic1x9BHgXXEG4zn7-	{"cookie":{"originalMaxAge":1296000000,"expires":"2026-07-24T15:41:54.698Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":1}}	2026-07-25 00:10:07
Y2HBtxRYPzJ9ey0vIk9CjtQ8UL7iMSs0	{"cookie":{"originalMaxAge":1296000000,"expires":"2026-07-24T12:40:24.616Z","httpOnly":true,"path":"/"},"passport":{"user":1}}	2026-07-25 00:29:54
iXhYqiPfHh85eWHtzOv72o-iPnl0lXIy	{"cookie":{"originalMaxAge":1296000000,"expires":"2026-07-24T15:45:51.969Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":1}}	2026-07-24 23:45:54
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, user_id, preferences) FROM stdin;
1	1	{"theme": "dark"}
\.


--
-- Data for Name: stories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stories (id, author_id, story_title, start_passage_id, is_pinned, is_private, share_slug, updated_at, created_at) FROM stdin;
2	1	The Last Ember	13	f	f	the-last-ember	2026-07-09 21:24:04.557582+08	2026-07-09 21:03:45.726044+08
3	1	Wheels Up	18	f	t	wheels-up	2026-07-09 21:33:50.009815+08	2026-07-09 21:25:41.704263+08
1	1	Signal Lost	2	t	f	signal-lost	2026-07-09 23:46:20.420447+08	2026-07-09 20:42:06.723482+08
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password, first_name, last_name) FROM stdin;
1	testuser	$2b$10$cJbl4d9Ig8gjLXFVAtytLO0Bdx/D2afesC8/32kHH98uyDp6ZL646	\N	\N
\.


--
-- Name: choices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.choices_id_seq', 28, true);


--
-- Name: passages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.passages_id_seq', 22, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ratings_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: stories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stories_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: choices choices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choices
    ADD CONSTRAINT choices_pkey PRIMARY KEY (id);


--
-- Name: passages passages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passages
    ADD CONSTRAINT passages_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_user_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_unique UNIQUE (story_id, from_user_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: stories stories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_pkey PRIMARY KEY (id);


--
-- Name: stories stories_share_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_share_slug_key UNIQUE (share_slug);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: choices choice_from_passage_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choices
    ADD CONSTRAINT choice_from_passage_fk FOREIGN KEY (from_passage_id) REFERENCES public.passages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: choices choice_to_passage_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choices
    ADD CONSTRAINT choice_to_passage_fk FOREIGN KEY (to_passage_id) REFERENCES public.passages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: passages passages_story_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passages
    ADD CONSTRAINT passages_story_fk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ratings ratings_story_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_story_fk FOREIGN KEY (story_id) REFERENCES public.stories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ratings ratings_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_fk FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: settings settings_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stories stories_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stories
    ADD CONSTRAINT stories_user_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict V44nKU4Dl5Ecg2OhCCcwEsuz8xQdEHMBsKmQYkrzlAglEiHXzGMkSYHIlJqqB2N

