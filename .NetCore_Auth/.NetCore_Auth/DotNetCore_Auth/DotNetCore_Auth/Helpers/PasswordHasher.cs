using System.Security.Cryptography;

namespace DotNetCore_Auth.Helpers
{
    public class PasswordHasher
    {
        private static RNGCryptoServiceProvider rNG = new RNGCryptoServiceProvider();
        private static readonly int SaltSize = 16;
        private static readonly int HashSize = 16;
        private static readonly int Iterations = 10000;

        public static string HashPassword(string Password)
        {
            byte[] salt;
            rNG.GetBytes(salt = new byte[SaltSize]);
            var Key = new Rfc2898DeriveBytes(Password, salt, Iterations);
            var Hash = Key.GetBytes(HashSize);

            var Hashbyte = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, Hashbyte, 0, SaltSize);
            Array.Copy(Hash, 0, Hashbyte, SaltSize, HashSize);

            var base64hash = Convert.ToBase64String(Hashbyte);
            return base64hash;
        }

        public static bool VerifyPassword(string Password, string base64Hash)
        {
            var hashByte = Convert.FromBase64String(base64Hash);

            var salt = new byte[SaltSize];
            Array.Copy(hashByte, 0, salt, 0, SaltSize);
            var Key = new Rfc2898DeriveBytes(Password, salt,Iterations);
            byte[] Hash = Key.GetBytes(HashSize);
            for (int i = 0; i < HashSize; i++)
            {
                if (hashByte[i + SaltSize] != Hash[i])
                {
                    return false;
                }
               
            }
            return true;

        }
    }
}

