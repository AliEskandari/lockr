### Collection

```js
{
  id: String, // Doc Id
  user: String, // User ref
  title: String,
  description: String,
  collectionSocialUnlocks: {
    key: Number,
    value: {
      id: Number,
      socialUnlock: String, // Social Unlock ref
      title: String
    }
  },
  errors: {...},
  isValid: Boolean
}
```

### Social Unlock

```js
{
  id: String, // Doc id
  user: String, // User ref
  title: String,
  destinationURL: String,
  unlocks: Number,
  views: Number,
  actions: {
    key: Number,
    value: {
      id: Number,
      type: String, // Enum
      url: String
    }
  },
  errors: {...},
  isValid: Boolean,
  status: String // Enum
}
```
