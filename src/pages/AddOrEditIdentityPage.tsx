import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIdentities } from '@/contexts/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { Identity } from '@/lib/types';
import ListInput from '@/components/ListInput';
import { Field, Fieldset, Input, Label, Textarea } from '@headlessui/react';
import Avatar from '@/components/Avatar';
import Hero from '@/components/Hero';
import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid';
import CircleProgress from '@/components/CircleProgress';
import Button from '@/components/Button';

const AddOrEditIdentityPage: React.FC<{ edit?: boolean }> = ({ edit = false }) => {
  const { didUri } = useParams();
  const navigate = useNavigate();
  const { createIdentity, updateIdentity, selectedIdentity, selectIdentity, dwnEndpoints } = useIdentities();
  const [loadedIdentity, setLoadedIdentity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const avatarImageRef = useRef<HTMLInputElement>(null);
  const bannerImageRef = useRef<HTMLInputElement>(null);

  const defaultForm = {
    persona: '',
    displayName: '',
    tagline: '',
    bio: '',
    dwnEndpoints: ['https://dwn.tbddev.org/latest'],
    avatar: null as File | Blob | null,
    banner: null as File | Blob | null,
  }

  const [formData, setFormData] = useState(defaultForm);

  const isEdit = edit && selectedIdentity;

  const resetForm = () => {
    setFormData(defaultForm);
    setAvatarPreview(null);
    setBannerPreview(null);
  }

  useEffect(() => {
    if (didUri && selectedIdentity?.didUri !== didUri) {
      selectIdentity(didUri);
    }
  }, [ didUri, selectedIdentity ]);

  useEffect(() => {
    const loadIdentityForm = async () => {
      if (!selectedIdentity) {
        return;
      };

      setFormData({
        persona: selectedIdentity.persona!,
        displayName: selectedIdentity.profile.social?.displayName || '',
        tagline: selectedIdentity.profile.social?.tagline || '',
        bio: selectedIdentity.profile.social?.bio || '',
        dwnEndpoints,
        avatar: selectedIdentity.profile.avatar || null,
        banner: selectedIdentity.profile.hero || null,
      });

      setAvatarPreview(selectedIdentity.profile.avatar ? URL.createObjectURL(selectedIdentity.profile.avatar) : null);
      setBannerPreview(selectedIdentity.profile.hero ? URL.createObjectURL(selectedIdentity.profile.hero) : null);

      setLoadedIdentity(true);
    }

    if (isEdit && selectedIdentity?.didUri === didUri && !loadedIdentity) {
      loadIdentityForm();
    } else if (!isEdit && selectedIdentity) {
      selectIdentity(undefined);
      resetForm();
    }

  }, [ isEdit, selectedIdentity, loadedIdentity, didUri ]);


  const submitDisabled = useMemo(() => {
    if (isEdit) {
      return formData.persona === selectedIdentity.persona &&
             formData.displayName === selectedIdentity.profile.social?.displayName &&
             formData.tagline === selectedIdentity.profile.social?.tagline &&
             formData.bio === selectedIdentity.profile.social?.bio &&
             formData.avatar === selectedIdentity.profile.avatar &&
             formData.banner === selectedIdentity.profile.hero &&
             (formData.dwnEndpoints.length === dwnEndpoints.length &&
              formData.dwnEndpoints.every(endpoint => dwnEndpoints.includes(endpoint)));
    }

    return formData.persona === '' || formData.displayName === '' || formData.dwnEndpoints.length === 0;
  }, [ isEdit, formData, selectedIdentity ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      let identity: Identity | undefined;
      if (isEdit) {
        await updateIdentity({
          didUri: selectedIdentity.didUri,
          persona: formData.persona,
          dwnEndpoints: formData.dwnEndpoints,
          displayName: formData.displayName,
          tagline: formData.tagline,
          bio: formData.bio,
          avatar: formData.avatar ? new Blob([formData.avatar], { type: formData.avatar.type }) : undefined,
          hero: formData.banner ? new Blob([formData.banner], { type: formData.banner.type }) : undefined,
        });

        identity = selectedIdentity;
      } else {
        identity = await createIdentity({
          persona: formData.persona,
          displayName: formData.displayName,
          tagline: formData.tagline,  
          bio: formData.bio,
          dwnEndpoints: formData.dwnEndpoints,
          walletHost: window.location.origin,
          avatar: formData.avatar ? new Blob([formData.avatar], { type: formData.avatar.type }) : undefined,
          hero: formData.banner ? new Blob([formData.banner], { type: formData.banner.type }) : undefined,
        });
      }

      if (!identity) {
        throw new Error('Failed to create identity');
      }
      navigate(`/identity/${identity.didUri}`);
    } catch (error) {
      console.error('Error creating identity:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'avatar') {
          setAvatarPreview(reader.result as string);
        } else if (name === 'banner') {
          setBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrClearHero = (e: React.MouseEvent<HTMLElement>) => {
    if (bannerPreview !== null) {
      setBannerPreview(null);
      setFormData({ ...formData, banner: null });
      if (bannerImageRef.current) {
        bannerImageRef.current.value = '';
        bannerImageRef.current.files = null;
      }
    } else {
      bannerImageRef.current?.click();
    }
  }

  return (<section className={`relative sm:px-8 md:px-12 max-w-screen-lg mx-auto`}>
   <div className="mt-10 flex flex-col break-words bg-white w-full mb-6 shadow-xl">
     <div className="w-full p-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
        <div className="text-xl text-left pl-4">
          {isEdit ? 'Edit Identity' : 'Add Identity'}
        </div>
        <form onSubmit={handleSubmit} className="pt-5">
          <Fieldset>
            <Field className="w-full">
              <Label htmlFor='persona' className="text-sm font-medium leading-6 text-gray-900">
                Persona <span className="text-red-500">*</span>
              </Label>
              <Input
                type='text'
                id='persona'
                name="persona"
                placeholder='Social, Professional, Gaming, etc.'
                value={formData.persona}
                onChange={handleInputChange}
                required={true}
                className={
                  'mt-1 mb-2 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
                }
              />
            </Field>
            <div className="flex gap-4">
              <Field className={"w-20 flex flex-col items-center relative"}>
                <Label htmlFor='avatar' className="text-sm font-medium leading-6 text-gray-900">Avatar</Label>
                <Avatar className="w-14" src={avatarPreview} />
                <div
                  className='cursor-pointer absolute bottom-0 right-0 rounded-full bg-red-600 p-1 font-semibold text-background'
                  onClick={() => 
                    avatarImageRef?.current?.click()
                  }
                >
                  <PlusIcon className='w-4 h-4' />
                  <Input
                    id='avatar'
                    type="file"
                    name='avatar'
                    ref={avatarImageRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </Field>
              <Field className="w-full">
                <Label htmlFor='displayName' className="text-sm font-medium leading-6 text-gray-900">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id='displayName'
                  type='text'
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required={true}
                  className={
                    'mt-1 mb-2 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
                  }
                />
              </Field>
            </div>
            <Field className={"flex flex-col relative"}>
                <Label htmlFor='banner' className="text-sm font-medium leading-6 text-gray-900">Banner</Label>
                <Hero className="w-full h-[200px]" src={bannerPreview} />
                <div
                  className={`flex items-center cursor-pointer rounded-full ${ bannerPreview ? 'bg-red-600' : 'bg-gray-600'} py-1 px-4 font-semibold text-background m-auto my-2`}
                  onClick={handleAddOrClearHero}
                >
                  {bannerPreview ? <XMarkIcon className="w-4 h-4 mr-2" /> : <PlusIcon className='w-4 h-4 mr-2' />}
                  {bannerPreview ? 'Clear Banner' : 'Add Banner'}
                  <Input
                    id='banner'
                    type="file"
                    name='banner'
                    ref={bannerImageRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </Field>
              <Field className="w-full">
              <Label htmlFor='tagline' className="text-sm font-medium leading-6 text-gray-900">
                Tagline
              </Label>
              <Input
                type='text'
                id='tagline'
                name="tagline"
                placeholder='Something catchy goes here...'
                value={formData.tagline}
                onChange={handleInputChange}
                className={
                  'mt-1 mb-2 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
                }
              />
            </Field>
            <Field className="w-full">
              <Label htmlFor='bio' className="text-sm font-medium leading-6 text-gray-900">
                Bio
              </Label>
              <Textarea
                id='bio'
                name="Bio"
                placeholder='Tell us about yourself...'
                value={formData.tagline}
                onChange={handleInputChange}
                rows={4}
                className={
                  'mt-1 mb-2 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
                }
              />
            </Field>
          </Fieldset>
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <CircleProgress />
            </div>
          ) : (
            <div>
              {!isEdit && <Field className="w-full">
                <Label htmlFor='dwnEndpoints' className="text-sm font-medium leading-6 text-gray-900">
                  DWN Endpoints <span className="text-red-500">*</span>
                </Label>
                <ListInput
                  className="w-full"
                  required={true}
                  label={"DWN Endpoint"}
                  value={formData.dwnEndpoints}
                  defaultValue={'https://dwn.tbddev.org/latest'}
                  placeholder='https://dwn.tbddev.org/latest'
                  onChange={(value) => {
                    setFormData({ ...formData, dwnEndpoints: value });
                  }}
                />
              </Field>}
              <div className="mt-4">
                <Button
                  type="submit"
                  disabled={loading || submitDisabled}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {isEdit ? 'Update Identity' : 'Add Identity'}
                </Button>
                {isEdit && (
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ ml: 2 }}
                    onClick={() => navigate(`/identity/${selectedIdentity.didUri}`)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  </section>);
};

export default AddOrEditIdentityPage;