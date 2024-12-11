I was interested in how I could reduce the time between when I pushed my code to GitHub and
when my code would be deployed.
One potential area for improvement I thought of was caching the results of `npm ci`,
since that took a long time on my machine. However, I was evidently not the first person to
think of this, since I found out that the `setup-node` action already does this internally.

I was curious how they did this, though, since the environments that GitHub workflows execute in
seem fairly sandboxed and isolated from one another.
As I read through the README for the `setup-node` action, I found out about the `save-cache` and
`restore-cache` actions, that allow one to store and restore arbitrary data between workflow runs,
and even between different workflows.

A cache is just a file or directory associated with a specific key at the time of creation.
GitHub actions provides an API for creating, updating, and restoring caches,
but to my dismay they don't seem to expose the actual mechanics of how this works under the hood, for
unfortunate (but perhaps understandable) reasons.

In the Javascript ecosystem, where it is idiomatic, blessed, and otherwise smiled upon
to depend on every package under the sun, caching can be used to significantly reduce the amount of time spent
waiting for dependencies to install. However, I feel like the actual power of GitHub's caching system is relatively
unutilized for javascript apps, since there is only really one "executable" object, that being the source code itself.

In contrast, when writing code which compiles into machine code, in a language like C or Rust,
there are a wide variety of target operating systems, hardware vendors,
and instruction sets which you may want to test as part of your workflow.
Compilation time, especially for large projects, may be quite large---on the order of hours
for the very largest and most complex projects---and that's for each target platform.

Thankfully, there are tools that allow us to mitigate this, such as incremental compilation, where only the parts
of code that are changed are recompiled. I think it would be very possible and beneficial to cache the results of an incremental
build process between workflow runs. There would certainly be some hurdles in doing this,
such as incompatibility between incremental builds for different target platforms.
One possible solution would be to associate each target with its own cache key; this way, you don't end up trying to link binaries
compiled for different targets.

In a broader sense, it is very interesting to think about how the principles of DevOps, which are often
thought of primarily in the context of deploying a reliable and scalable web application,
can be applied to more the more "old-school" programming disciplines which I more strongly gravitate towards.
