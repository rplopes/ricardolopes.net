---
layout: post
title: A layman's guide to good passwords online
category: tutorial
tags:
 - cybersecurity
---

We have a problem with passwords: they suck. They're hard to memorise, easy to steal and sometimes have to fit to very specific and silly rules. Online security, nowadays, is just too complicated. So most people tend to end up ignoring security practises, making them vulnerable to cyberattacks. You know you should be doing better, but you don't know exactly how or why, and your patience and energy are better focused somewhere else, right? If so, then this guide is for you.

Let's start debunking some myths and exploring easy and secure practises you can start implementing today. By the end of this guide, dealing with your passwords should actually be simpler and need less of your energy than before.

## Use long, not cryptic passwords

You've probably heard that the strongest passwords are the ones that have letters (lowercase and uppercase), numbers, special symbols like # or ! and that aren't common words. So something like `b@2Y&s` would be great. But that's too hard to remember, so you go for something simpler, or decide to note that down somewhere.

I have some good news for you: that example password I just showed you is actually terrible, and you shouldn't torture yourself trying to memorise something like that. Why is it terrible?

A typical attack tries to guess your password by trying every single possible combination of characters until it finds the right one. So it could start trying for `a`, then `b`, then `c`, at some point going through `Y`, `Z`, `aa`, `ab`, and so on. For 1-character long passwords with letters and numbers, that means that such an attack tries 62 different possibilities (26 lowercase letters, 26 uppercase letters and 10 numbers, from 0 to 9). For 2-characters long passwords, the number of different possibilities rises to 3,906. And so on. For a 6-characters long password that's around 57 billion different combinations.

But `b@2Y&s` includes special symbols like @ and +. Let's say that means that there are now 38 more symbols to consider, making it a total of 100 (26 lowercase letters, 26 uppercase letters, 10 numbers and 38 special symbols). Now, the number of different possibilities to consider to break your 6-characters long password increases to 1 trillion. That's why adding those symbols is good: it's more combinations that attackers have to try.

However, if, instead of adding those symbols, we just increase the password size from 6 to 8 characters, the number of different combinations rises to 222 trillion. So a password like `2Bananas` is 222 times harder to break than a password like `b@2Y&s`! If you add numbers and special symbols it gets even better, of course. But that doesn't mean having to come up with impossible to remember passwords. Something like `2Bananas!!` would need 101,010,101 trillion combinations (also because it increases in size).

Why is this important? Those numbers of different combinations might all seem too big to be a problem. However, computers are getting increasingly fast. If a computer can try a billion combinations per second, for instance, then breaking `b@2Y&s` takes less than 17 minutes. Breaking `2Bananas` would take around 2.5 hours. Breaking `2Bananas!!` would take 3,200 years.

So if there's one thing you should be remembering from this post is this: longer passwords are *way* better than shorter passwords, even if you don't use special characters. They're also way easier to remember. So go ahead and change them now. The biggest example I showed was still small (just 10-characters long), so that the numbers wouldn't be too high to understand. But in practise it's better to use even longer passwords.

[Here's a great comic](http://xkcd.com/936/) on this topic.

## Don't use common passwords

Just because you were just freed from using cryptic passwords like `Rs*F2Q9kn%[L`, it doesn't mean that you can use *any* word for a password. You've just learned how to protect against a brute-force attack, but there are other kinds of attacks.

Attackers know that brute-force attacks can be extremely inefficient against long passwords. Wait 3,200 years to break a password? Good luck with that. So they like shortcuts. If a lot of people use `password`, `qwerty`, `1234567890` or others, then there's no need to wait for all possible combinations: they can just try those ones first. Here's a list of the 10 most common passwords, as of 2014:

 1. `123456`
 2. `password`
 3. `12345`
 4. `12345678`
 5. `qwerty`
 6. `1234567890`
 7. `1234`
 8. `baseball`
 9. `dragon`
 10. `football`

A lot of accounts are currently using one of those passwords. This means that if an attacker doesn't want to wait to get access to logged in accounts, they just need to try these. So if you use any of these passwords for any of your online accounts, change it *right now*, because it takes any serious attacker a fraction of a second to break it, even if you're not specifically the only target! In fact, take a look at the [original, longer list](http://www.prweb.com/releases/2015/01/prweb12456779.htm) and make sure it's not in there also.

Using your email address, full name, name of the website you're visiting or anything like that isn't also going to be a lot safer. Those are all things that an attacker will know. So it's important that you choose uncommon or illogical words or phrases, because those will be nearly impossible to guess (once again, refer to the comic in the previous section).

So, one last time, please remember: *never* use any of those most popular passwords as a password to any kind of account you might have. Having one of those is almost as safe as having nothing at all.

## Don't repeat passwords

You've probably heard this one before. You should have different passwords for every account. But it's so hard to remember any password, how could anyone possibly remember that many? And why should you even do it, exactly?

If a website you're using doesn't properly protect login details and gets hacked, a list with your email and password gets leaked for every attacker to use. So if you're using the same combination in different websites, no matter how secure they might be, your account there will still be compromised. Sometimes you don't even need to have a website get hacked: you just need someone to get physical access to your PC, or to [glance at your post-it with a complicated password written down](http://arstechnica.com/security/2015/04/hacked-french-network-exposed-its-own-passwords-during-tv-interview/), among other possibilities. Getting passwords is easy. So you don't want people entering your bank account because somebody watched you type your Facebook password.

So how can anyone remember so many different passwords? I hope that if you read the previous sections, this one gets easier. We've discussed how cryptic, impossible to memorise passwords aren't that good, and how memorable phrases are actually much more secure. If that still sounds too difficult to do for every single account you have online, then make sure that you do it at least for the most important ones (like your bank account, or your email account where you keep important confidential notes).

Since you should now be using phrases as passwords, you might want to make some rules that let you have different passwords for different accounts without having too much to memorise. For instance, you could include the main colour of the website. So for Facebook you could use `2BlueBananas`, and for GMail `2RedBananas`. This isn't perfect, and you shouldn't be too obvious (like just adding the website name), but it's better than nothing.

A better approach to have great passwords that never repeat for different websites is to use a password manager. A password manager is an application that you can have in your devices that will generate strong passwords for your and store them securely. This way, passwords can be long and cryptic, because you don't need to remember them, and you can have one of those per account. Comparing different password managers and explaining how to use them goes out of scope of this guide, but it might be a good topic for a future one. If you're curious, I invite you to investigate more and start using one. It will be the best you'll do for your security online.

### I'm lost, summary please

 * Use long passwords. For every character that you add, breaking your password gets incredibly more difficult. It's ok if it's 20, 30 characters long.
 * Don't use cryptic passwords. There's no point in trying to memorise `b@2Y&s` (or noting it down somewhere insecure) if longer, more memorable passwords like `2Bananas!!` are way more secure.
 * Don't use common passwords. Those are the absolute worst. Really. Never use anything from [this list](http://www.prweb.com/releases/2015/01/prweb12456779.htm).
 * Use different passwords for different accounts. At least for important accounts, like your bank.
 * Coming up with some rules (like adding the colour of the website) is not perfect, but better than doing nothing.
 * Better yet, you could start using a password manager that will pick great passwords for you and store them securely, so that you can have one per account and will never need to memorise them again.
 * Watch this [short interview with Edward Snowden](https://www.youtube.com/watch?v=yzGzB-yYKcc), who knows a lot more about this than I do.
 * Share this post with your friends. Seriously, they're probably vulnerable to cyberattacks right now, and you can help them improve their security online.
